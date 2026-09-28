

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">



        <div className="flex flex-1 w-full pt-16">


         <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">


          <section className="bg-blue-600 text-white rounded-2xl p-6 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div> 
                   <h2 className="text-2xl font-bold">Busca una sala para jugar</h2>
                    <p className="text-blue-100 mt-1">Ingresa a una sala para empezar.</p>
                </div>
                    <button type="button" className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl shadow hover:bg-blue-50 transition-all text-center">
                        Buscar sala
                    </button>
            </div>
          </section>



            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="space-y-6">

                </div>

            </div>
        </main>

      </div>


    </div>
  );
};

export default HomePage;