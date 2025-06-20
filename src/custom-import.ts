interface PasteOptions {
  clear: boolean;
  append: boolean;
  columns: string[];
}
interface ConsultOptions {
  consultSheetId: string;
  consultSheetRange: string;
  pasteSheetId: string;
  pasteSheetRange: string;
}
interface FilterDefinition {
  operator: "===" | ">" | "<" | ">=" | "<=" | "!==";
  value: unknown;
}

interface ImportConfigs {
  pasteOptions: PasteOptions;
  consultOptions: ConsultOptions;
  filterOptions: Record<string, FilterDefinition>;
}
export async function moveDataBetweenSheets(
  importConfigs: ImportConfigs,
): Promise<void> {
  const { pasteOptions, consultOptions, filterOptions } = importConfigs;
  if (
    !/.+![a-zA-Z]+\d*:?[a-zA-Z]*\d*/.test(consultOptions.consultSheetRange) ||
    !/.+![a-zA-Z]+\d*:?[a-zA-Z]*\d*/.test(consultOptions.pasteSheetRange)
  ) {
    throw new Error('Invalid range format. Expected format: "SheetName!A1:B2"');
  }
  const consultSheetsData = Sheets.Spreadsheets?.Values?.get(
    consultOptions.consultSheetId,
    consultOptions.consultSheetRange,
  ).values;
  if (!consultSheetsData || consultSheetsData.length === 0) {
    throw new Error("No data found in the consult sheet range.");
  }
  let processedData =
    filterOptions === undefined
      ? consultSheetsData
      : applyFilter_(consultSheetsData, filterOptions);

  if (pasteOptions?.columns) {
    processedData = selectColumns_(processedData, pasteOptions.columns);
  }
  if (pasteOptions && pasteOptions.clear) {
    Sheets.Spreadsheets?.Values?.clear(
      {},
      consultOptions.pasteSheetId,
      consultOptions.pasteSheetRange,
    );
  }
  // Sheets.Spreadsheets?.Values?[pasteOptions?.append ? "append" : "update"](
  //   { values: processedData },
  //   consultOptions.pasteSheetId,
  //   consultOptions.pasteSheetRange,
  //   { valueInputOption: "USER_ENTERED" },
  // );
}

function applyFilter_<T>(
  arrayToFilter: T[][],
  filterConditions: Record<string, FilterDefinition>,
) {
  const operators = {
    "=": (a, b) => {
      const convertedA = convertToType_(a, b);
      return convertedA === b;
    },
    "!=": (a, b) => {
      const convertedA = convertToType_(a, b);
      return convertedA !== b;
    },
    ">": (a, b) => {
      const convertedA = convertToType_(a, b);
      return convertedA > b;
    },
    ">=": (a, b) => {
      const convertedA = convertToType_(a, b);
      return convertedA >= b;
    },
    "<": (a, b) => {
      const convertedA = convertToType_(a, b);
      return convertedA < b;
    },
    "<=": (a, b) => {
      const convertedA = convertToType_(a, b);
      return convertedA <= b;
    },
    "<>": (a, b) => {
      const convertedA = convertToType_(a, b);
      return convertedA !== b;
    },
    in: (a, b) => {
      if (!Array.isArray(b) || b.length === 0) {
        console.warn(`Please provide a non empty array for the 'in' operator.`);
        return false;
      }
      const convertedA = convertToType_(a, b[0]);
      return b.includes(convertedA);
    },
  };
  return arrayToFilter.filter((row) => {
    return Object.keys(filterConditions).every((col) => {
      const columnConditions = Array.isArray(filterConditions[col])
        ? filterConditions[col]
        : [filterConditions[col]];
      const columnIndex = columnToNumber_(col.toUpperCase());
      const rowValue = row[columnIndex];

      if (
        columnIndex === undefined ||
        columnIndex < 0 ||
        columnIndex >= row.length
      ) {
        console.warn(
          `Column "${col}" was not found in the row. Expected index: ${columnIndex}, but row length is ${row.length}.`,
        );
        return false; // Se a coluna não existe na linha, a condição falha
      }

      const columnOperators = columnConditions.map((condition) => {
        return condition.operator;
      });

      if (
        !columnOperators ||
        columnOperators.length === 0 ||
        columnOperators.some((columnOperator) => !operators[columnOperator])
      ) {
        console.warn(
          `Operador(es) "${columnOperators}" inválido(s) para a coluna ${col}`,
        );
        return false;
      }
      return columnConditions.every((condition) => {
        if (
          !condition ||
          typeof condition.operator === "undefined" ||
          typeof condition.value === "undefined"
        ) {
          console.warn(
            `Objeto de condição inválido ou incompleto para a coluna ${col}:`,
            condition,
          );
          return false;
        }

        if (!operators[condition.operator]) {
          console.warn(
            `Operador "${condition.operator}" inválido para a coluna ${col}`,
          );
          return false;
        }
        return operators[condition.operator](rowValue, condition.value);
      });
    });
  });
}

function getType_(value: unknown): string {
  if (Object.prototype.toString.call(value) === "[object Date]") return "date";
  return typeof value;
}

function convertToType_(value: unknown, reference: unknown) {
  const type = getType_(reference);

  switch (type) {
    case "number":
      return parseFloat(String(value));
    case "date":
      return value instanceof Date
        ? value
        : new Date(
            value
              ? value.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3")
              : new Date(0, 0, 1),
          );
    case "string":
      return String(value);
    case "boolean":
      return Boolean(value);
    default:
      return value;
  }
}

function selectColumns_<T>(data: T[][], columns: string[]): T[][] {
  const columnIndexes = columns.map((col) =>
    columnToNumber_(col.toUpperCase()),
  );
  return data.map((row) => columnIndexes.map((index) => row[index]));
}
function columnToNumber_(column: string): number {
  let result = 0;
  for (let i = 0; i < column.length; i++) {
    result = result * 26 + (column.charCodeAt(i) - 64);
  }
  return result - 1;
}
