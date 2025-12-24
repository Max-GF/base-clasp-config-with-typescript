
const App = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="p-10 bg-white rounded-lg shadow-xl text-center">
        <h1 className="text-3xl font-bold text-blue-600 underline">
          Funciona!
        </h1>
        <p className="mt-4 text-gray-600">
          React + Tailwind + Google Apps Script
        </p>
        <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
          Clique aqui
        </button>
      </div>
    </div>
  );
};

export default App;