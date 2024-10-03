const express = require('express');
const dbconnect = require('./config');
const { PelisModel, PlanetasModel, especiesModel, NavesModel, VehiculosModel, PersonajesModel } = require('./model'); // Asegúrate de que la ruta sea correcta


const axios = require('axios');
const app = express();
const port = 5000;

app.use(express.json());
dbconnect();

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});


///////////////////////////////////////////         PELICULAS  CRUD        ///////////////////////////////////////////
app.post("/Peliculas", async (req, res) => {
    try {
        const existe = await PelisModel.findOne({ Titulo: req.body.Titulo });
        if (existe) {
            console.log(`La película ${req.body.Titulo} ya existe. No se guardará.`);
            return res.status(409).send(`La película ${req.body.Titulo} ya existe.`); // Código 409: Conflicto
        }
        
        const nueva = new PelisModel(req.body);
        const guardar = await nueva.save();
        res.status(201).send(guardar); 
    } catch (error) {
        res.status(400).send("Error al crear película: " + error.message);
    }
});




app.get("/Peliculas/id/:id", async (req, res) => {
    try {
        const id = req.params.id; 
        const pelis = await PelisModel.findById(id, {createdAt: 0, updatedAt: 0}); 
        if (!pelis) {
            return res.status(404).send("Pelicula no encontrado");
        }
        res.send(pelis);
    } catch (error) {
        res.status(400).send("Error al obtener Pelicula: " + error.message);
    }
});


app.get("/Peliculas/personajes/", async (req, res) => {
    try {
        const pelis = await PelisModel.find({}, {Titulo:1, _id:1}); 
        if (pelis.length === 0) {
            return res.status(404).send("Pelicula no encontrado");
        }
        res.send(pelis);
    } catch (error) {
        res.status(400).send("Error al obtener Pelicula: " + error.message);
    }
});


app.get("/Peliculas/modulo/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10; 
        const skip = (page - 1) * limit;
        const pelis = await PelisModel.find({}, { createdAt: 0, updatedAt: 0 })
            .skip(skip)
            .limit(limit);
        res.send({
            page,
            limit,
            pelis,
        });
    } catch (error) {
        res.status(400).send("Error al obtener películas: " + error.message);
    }
});




app.delete("/Peliculas/Delete/:id", async (req, res) => {
    try {
        const id = req.params.id; 
        const pelis = await PelisModel.findById(id); 
        if (!pelis) {
            return res.status(404).send("Pelicula no encontrada");
        }
        await PelisModel.findByIdAndDelete(id);
        res.send({ message: "Pelicula eliminada", pelicula: pelis });
    } catch (error) {
        res.status(400).send("Error al eliminar Pelicula: " + error.message);
    } 
});


app.put("/Peliculas/Modificar/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const pelis = await PelisModel.findById(id);
        if (!pelis) {
            return res.status(404).send("Pelicula no encontrada");
        }

        const existe = await PelisModel.findOne({ Titulo: req.body.Titulo });
        if (existe) {
            console.log(`La película ${req.body.Titulo} ya existe. No se guardará.`);
            return res.status(409).send(`La película ${req.body.Titulo} ya existe.`); // Código 409: Conflicto
        }

        const updatedPelis = await PelisModel.findByIdAndUpdate(id, req.body, { new: true });
        res.send({ message: "Pelicula Modificada", pelicula: updatedPelis });
    } catch (error) {
        res.status(400).send("Error al modificar Pelicula: " + error.message);
    }

});




///////////////////////////////////////////         PLANETAS  CRUD          ///////////////////////////////////////////
app.post("/Planetas", async (req, res) => {
    try {
        const existe = await PlanetasModel.findOne({ Nombre: req.body.Nombre });

        if (existe) {
            console.log(`El Planeta ${req.body.Nombre} ya existe. No se guardará.`);
            return res.status(409).send(`El Planeta ${req.body.Nombre} ya existe.`); 
        }
        const nuevoplaneta = new PlanetasModel(req.body);
        const guardarplaneta = await nuevoplaneta.save();
        res.status(201).send(guardarplaneta);

    } catch (error) {
        res.status(400).send("Error al crear Planeta: " + error.message);
    }
});

app.get("/Planetas/id/:id", async (req, res) => {
    try {
        const id = req.params.id; 
        const planets = await PlanetasModel.findById(id, {createdAt: 0, updatedAt: 0}); 
        if (!planets) {
            return res.status(404).send("Planeta no encontrado");
        }
        res.send(planets);
    } catch (error) {
        res.status(400).send("Error al obtener Planeta: " + error.message);
    }
});


app.get("/Planetas/personajes/", async (req, res) => {
    try {
        const planets = await PlanetasModel.find({}, {Nombre:1, _id:1}); 
        if (planets.length === 0) {
            return res.status(404).send("Planeta no encontrado");
        }
        res.send(planets);
    } catch (error) {
        res.status(400).send("Error al obtener Planeta: " + error.message);
    }
});


app.get("/Planetas/modulo/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10; 
        const skip = (page - 1) * limit;
        const planets = await PlanetasModel.find({}, { createdAt: 0, updatedAt: 0 })
            .skip(skip)
            .limit(limit);
        res.send({
            page,
            limit,
            planets,
        });
    } catch (error) {
        res.status(400).send("Error al obtener planetas: " + error.message);
    }
});


app.delete("/Planetas/Delete/:id", async (req, res) => {
    try {
        const id = req.params.id; 
        const planets = await PlanetasModel.findById(id); 
        if (!planets) {
            return res.status(404).send("Planeta no encontrado");
        }
        await PlanetasModel.findByIdAndDelete(id);
        res.send({ message: "Planeta eliminado", Planeta: planets });
    } catch (error) {
        res.status(400).send("Error al eliminar Planeta: " + error.message);
    } 
});

app.put("/Planetas/Modificar/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const planets = await PlanetasModel.findById(id);
        if (!planets) {
            return res.status(404).send("Planeta no encontrado");
        }
        const existe = await PlanetasModel.findOne({ Nombre: req.body.Nombre });
        if (existe) {
            console.log(`El Planeta ${req.body.Nombre} ya existe. No se guardará.`);
            return res.status(409).send(`El Planeta ${req.body.Nombre} ya existe.`); // Código 409: Conflicto
        }
        const updatedplanets = await PlanetasModel.findByIdAndUpdate(id, req.body, { new: true });
        res.send({ message: "Planeta Modificado", Planeta: updatedplanets });
    } catch (error) {
        res.status(400).send("Error al modificar Planeta: " + error.message);
    }

});




///////////////////////////////////////////             NAVES  CRUD             ///////////////////////////////////////////
app.post("/Naves", async (req, res) => {
    try {
        const existe = await NavesModel.findOne({ Nombre: req.body.Nombre });
        if (existe) {
            console.log(`La Naves ${req.body.Nombre} ya existe. No se guardará.`);
            return res.status(409).send(`La Nave ${req.body.Nombre} ya existe.`); // Código 409: Conflicto
        }
        const nueva = new NavesModel(req.body);
        const guardar = await nueva.save();
        res.status(201).send(guardar); 
    } catch (error) {
        res.status(400).send("Error al crear Nave: " + error.message);
    }
});



app.get("/Naves/id/:id", async (req, res) => {
    try {
        const id = req.params.id; 
        const modelo = await NavesModel.findById(id, {createdAt: 0, updatedAt: 0}); 
        if (!modelo) {
            return res.status(404).send("Nave no encontrada");
        }
        res.send(modelo);
    } catch (error) {
        res.status(400).send("Error al obtener Nave: " + error.message);
    }
});


app.get("/Naves/personajes/", async (req, res) => {
    try {
        const modelo = await NavesModel.find({}, {Nombre:1, _id:1}); 
        if (modelo.length === 0) {
            return res.status(404).send("Nave no encontrada");
        }
        res.send(modelo);
    } catch (error) {
        res.status(400).send("Error al obtener Nave: " + error.message);
    }
});


app.get("/Naves/modulo/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10; 
        const skip = (page - 1) * limit;
        const modelo = await NavesModel.find({}, { createdAt: 0, updatedAt: 0 })
            .skip(skip)
            .limit(limit);
        res.send({
            page,
            limit,
            naves: modelo, 
        });
    } catch (error) {
        res.status(400).send("Error al obtener naves: " + error.message);
    }
});



app.delete("/Naves/Delete/:id", async (req, res) => {
    try {
        const id = req.params.id; 
        const modelo = await NavesModel.findById(id); 
        if (!modelo) {
            return res.status(404).send("nave no encontrada");
        }
        await NavesModel.findByIdAndDelete(id);
        res.send({ message: "Nave eliminada", naves: modelo });
    } catch (error) {
        res.status(400).send("Error al eliminar naves: " + error.message);
    } 
});

app.put("/Naves/Modificar/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const modelo = await NavesModel.findById(id);
        if (!modelo) {
            return res.status(404).send("nave no encontrada");
        }
        const existe = await NavesModel.findOne({ Nombre: req.body.Nombre });
        if (existe) {
            console.log(`La nave ${req.body.Nombre} ya existe. No se guardará.`);
            return res.status(409).send(`La nave ${req.body.Nombre} ya existe.`); // Código 409: Conflicto
        }
        const updated = await NavesModel.findByIdAndUpdate(id, req.body, { new: true });
        res.send({ message: "nave Modificada", naves: updated });
    } catch (error) {
        res.status(400).send("Error al modificar naves: " + error.message);
    }

});




///////////////////////////////////////////         ESPECIES  CRUD          ///////////////////////////////////////////
app.post("/Especies", async (req, res) => {
    try {
        const existe = await especiesModel.findOne({ Nombre: req.body.Nombre });

        if (existe) {
            console.log(`La especie ${req.body.Nombre} ya existe. No se guardará.`);
            return res.status(409).send(`La especie ${req.body.Nombre} ya existe.`); // Código 409: Conflicto
        }
        const nueva = new especiesModel(req.body);
        const guardar = await nueva.save();
        res.status(201).send(guardar); 
    } catch (error) {
        res.status(400).send("Error al crear especie: " + error.message);
    }
});

app.get("/Especies/id/:id", async (req, res) => {
    try {
        const id = req.params.id; 
        const modelo = await especiesModel.findById(id, {createdAt: 0, updatedAt: 0}); 
        if (!modelo) {
            return res.status(404).send("especie no encontrado");
        }
        res.send(modelo);
    } catch (error) {
        res.status(400).send("Error al obtener especie: " + error.message);
    }
});


app.get("/Especies/personajes/", async (req, res) => {
    try {
        const modelo = await especiesModel.find({}, {Nombre:1, _id:1}); 
        if (modelo.length === 0) {
            return res.status(404).send("especie no encontrado");
        }
        res.send(modelo);
    } catch (error) {
        res.status(400).send("Error al obtener especie: " + error.message);
    }
});


app.get("/Especies/modulo/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10; 
        const skip = (page - 1) * limit;
        const modelo = await especiesModel.find({}, { createdAt: 0, updatedAt: 0 })
            .skip(skip)
            .limit(limit);
        res.send({
            page,
            limit,
            especies: modelo, 
        });
    } catch (error) {
        res.status(400).send("Error al obtener especies: " + error.message);
    }
});


app.delete("/Especies/Delete/:id", async (req, res) => {
    try {
        const id = req.params.id; 
        const modelo = await especiesModel.findById(id); 
        if (!modelo) {
            return res.status(404).send("especie no encontrado");
        }
        await especiesModel.findByIdAndDelete(id);
        res.send({ message: "Especies eliminado", especie: modelo });
    } catch (error) {
        res.status(400).send("Error al eliminar especie: " + error.message);
    } 
});



app.put("/Especies/Modificar/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const modelo = await especiesModel.findById(id);
        if (!modelo) {
            return res.status(404).send("especie no encontrada");
        }
        const existe = await especiesModel.findOne({ Nombre: req.body.Nombre });
        if (existe) {
            console.log(`La especie ${req.body.Nombre} ya existe. No se guardará.`);
            return res.status(409).send(`La especie ${req.body.Nombre} ya existe.`); // Código 409: Conflicto
        }
        const updated = await especiesModel.findByIdAndUpdate(id, req.body, { new: true });
        res.send({ message: "especie Modificada", especie: updated });
    } catch (error) {
        res.status(400).send("Error al modificar especie: " + error.message);
    }

});







///////////////////////////////////////////         VEHICULOS  CRUD         ///////////////////////////////////////////
app.post("/Vehiculos", async (req, res) => {
    try {
        const existe = await VehiculosModel.findOne({ Nombre: req.body.Nombre });

        if (existe) {
            console.log(`El Vehiculo ${req.body.Nombre} ya existe. No se guardará.`);
            return res.status(409).send(`El Vehiculo ${req.body.Nombre} ya existe.`); // Código 409: Conflicto
        }
        const nueva = new VehiculosModel(req.body);
        const guardar = await nueva.save();
        res.status(201).send(guardar); 
    } catch (error) {
        res.status(400).send("Error al crear Vehiculo: " + error.message);
    }
});

app.get("/Vehiculos/id/:id", async (req, res) => {
    try {
        const id = req.params.id; 
        const modelo = await VehiculosModel.findById(id, {createdAt: 0, updatedAt: 0}); 
        if (!modelo) {
            return res.status(404).send("Vehiculo no encontrado");
        }
        res.send(modelo);
    } catch (error) {
        res.status(400).send("Error al obtener especie: " + error.message);
    }
});


app.get("/Vehiculos/personajes/", async (req, res) => {
    try {
        const modelo = await VehiculosModel.find({}, {Nombre:1, _id:1}); 
        if (modelo.length === 0) {
            return res.status(404).send("Vehiculo no encontrado");
        }
        res.send(modelo);
    } catch (error) {
        res.status(400).send("Error al obtener especie: " + error.message);
    }
});
app.get("/Vehiculos/modulo/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10; 
        const skip = (page - 1) * limit;
        const modelo = await VehiculosModel.find({}, { createdAt: 0, updatedAt: 0 })
            .skip(skip)
            .limit(limit);
        res.send({
            page,
            limit,
            vehiculos: modelo, 
        });
    } catch (error) {
        res.status(400).send("Error al obtener vehículos: " + error.message);
    }
});


app.delete("/Vehiculos/Delete/:id", async (req, res) => {
    try {
        const id = req.params.id; 
        const modelo = await VehiculosModel.findById(id); 
        if (!modelo) {
            return res.status(404).send("Vehiculo no encontrado");
        }
        await VehiculosModel.findByIdAndDelete(id);
        res.send({ message: "Vehiculo eliminado", Vehiculo: modelo });
    } catch (error) {
        res.status(400).send("Error al eliminar Vehiculo: " + error.message);
    } 
});

app.put("/Vehiculos/Modificar/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const modelo = await VehiculosModel.findById(id);
        if (!modelo) {
            return res.status(404).send("Vehiculo no encontrado");
        }
        const existe = await VehiculosModel.findOne({ Nombre: req.body.Nombre });
        if (existe) {
            console.log(`El Vehiculo ${req.body.Nombre} ya existe. No se guardará.`);
            return res.status(409).send(`El Vehiculo ${req.body.Nombre} ya existe.`); // Código 409: Conflicto
        }
        const updated = await VehiculosModel.findByIdAndUpdate(id, req.body, { new: true });
        res.send({ message: "Vehiculo Modificado", Vehiculo: updated });
    } catch (error) {
        res.status(400).send("Error al modificar Vehiculo: " + error.message);
    }

});



///////////////////////////////////////////         PERSONAJES  CRUD        ///////////////////////////////////////////
app.post("/Personajes", async (req, res) => {
    try {
        const existe = await PersonajesModel.findOne({ Nombre: req.body.Nombre });

        if (existe) {
            console.log(`El Personaje ${req.body.Nombre} ya existe. No se guardará.`);
            return res.status(409).send(`El Personaje ${req.body.Nombre} ya existe.`); // Código 409: Conflicto
        }
        const nueva = new PersonajesModel(req.body);
        const guardar = await nueva.save();
        res.status(201).send(guardar); 
    } catch (error) {
        res.status(400).send("Error al crear Personaje: " + error.message);
    }
});


app.get("/Personajes/nombre/:nombre", async (req, res) => {
    try {
        const nombre = req.params.nombre; 
        if (!nombre) {
            return res.status(400).send("El nombre es requerido.");
        }
        const modelo = await PersonajesModel.findOne({ Nombre: nombre }, { createdAt: 0, updatedAt: 0 }); 
        if (!modelo) {
            console.log(nombre);
            return res.status(404).send("Personaje no encontrado");
        }
        res.send(modelo);
    } catch (error) {
        res.status(400).send("Error al obtener personaje: " + error.message);
    }
});



app.get("/Personajes/id/:id", async (req, res) => {
    try {
        const id = req.params.id; 
        const modelo = await PersonajesModel.findById(id, {createdAt: 0, updatedAt: 0}); 
        if (!modelo) {
            return res.status(404).send("Personaje no encontrado");
        }
        res.send(modelo);
    } catch (error) {
        res.status(400).send("Error al obtener Personaje: " + error.message);
    }
});


app.get("/Personajes/personajes/", async (req, res) => {
    try {
        const modelo = await PersonajesModel.find({}, {Nombre:1, _id:1}); 
        if (modelo.length === 0) {
            return res.status(404).send("Personaje no encontrado");
        }
        res.send(modelo);
    } catch (error) {
        res.status(400).send("Error al obtener Personaje: " + error.message);
    }
});


app.get("/Personajes/modulo/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const modelo = await PersonajesModel.find({}, { createdAt: 0, updatedAt: 0 })
            .skip(skip)
            .limit(limit);
        res.send({

            page,
            limit,
            personajes: modelo, 
        });
    } catch (error) {
        res.status(400).send("Error al obtener personajes: " + error.message);
    }
});






app.delete("/Personajes/Delete/:id", async (req, res) => {
    try {
        const id = req.params.id; 
        const modelo = await PersonajesModel.findById(id); 
        if (!modelo) {
            return res.status(404).send("Personaje no encontrado");
        }
        await PersonajesModel.findByIdAndDelete(id);
        res.send({ message: "Personaje eliminado", Personaje: modelo });
    } catch (error) {
        res.status(400).send("Error al eliminar Personaje: " + error.message);
    } 
});

app.put("/Personajes/Modificar/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const modelo = await PersonajesModel.findById(id);
        if (!modelo) {
            return res.status(404).send("Personaje no encontrado");
        }
        const existe = await PersonajesModel.findOne({ Nombre: req.body.Nombre });
        if (existe) {
            console.log(`El Personaje ${req.body.Nombre} ya existe. No se guardará.`);
            return res.status(409).send(`El Personaje ${req.body.Nombre} ya existe.`); // Código 409: Conflicto
        }
        const updated = await PersonajesModel.findByIdAndUpdate(id, req.body, { new: true });
        res.send({ message: "Personaje Modificado", Personaje: updated });
    } catch (error) {
        res.status(400).send("Error al modificar Personaje: " + error.message);
    }

});




/////////////////////////////////////           LLENADO BD          ///////////////////////////////////////
/////////////////////////////////////           Peliculas           ///////////////////////////////////////
const llenarBDpeliculas = async () => {
    try {

        const response = await axios.get(`https://swapi.dev/api/films`);
        const peliculas = response.data.results; 
        const promises = peliculas.map(async peli => {
        const existepelicula = await PelisModel.findOne({ Titulo: peli.title });
            if (!existepelicula) {
            const nueevapelicula = new PelisModel({
                Titulo: peli.title,
                Director: peli.director,
                Productor: peli.producer,
            });
            return nueevapelicula.save();
            } else {
                console.log(`El planeta ${peli.title} ya existe. No se guardará.`);
            }
        });
        await Promise.all(promises); 
        console.log("Películas guardadas con éxito.");
    } catch (error) {
        console.error("Error al llenar la base de datos: ", error.message);
    }
};
llenarBDpeliculas();



const llenarBDplanetas = async () => {
    try {
        let page = 1;
        let pagina = true;
        while (pagina) {
        const response = await axios.get(`https://swapi.dev/api/planets/?page=${page}`);
        const planetas = response.data.results;
        if (planetas.length === 0) {
            pagina = false; 
            break;
        }
        const promises = planetas.map(async planeta => {
            const existePlaneta = await PlanetasModel.findOne({ Nombre: planeta.name });
            if (!existePlaneta) {
                const nuevoPlaneta = new PlanetasModel({
                    Nombre: planeta.name,
                    Diametro: planeta.diameter,
                    Periodo_Rotacion: planeta.rotation_period,
                    Periodo_Orbital: planeta.orbital_period,
                    Gravedad: planeta.gravity,
                    Poblacion: planeta.population,
                    Clima: planeta.climate,
                    Terreno: planeta.terrain,
                    Superficie_Agua: planeta.surface_water,
                });
                return nuevoPlaneta.save();
            } else {
                console.log(`El planeta ${planeta.name} ya existe. No se guardará.`);
            }
        });
        await Promise.all(promises);
        console.log("Planetas guardados con éxito.");
        page++; 
    }
    } catch (error) {
        console.error("Errores al llenar la base de datos: ", error.message);
    }
};
llenarBDplanetas();


/////////////////////////////////////       Especies        ///////////////////////////////////////
const llenarBDespecies = async () => {
    try {

        let page = 1;
        let pagina = true;
        while (pagina) {
        const response = await axios.get(`https://swapi.dev/api/species/?page=${page}`);
        const especies = response.data.results;
        if (especies.length === 0) {
            pagina = false; 
            break;
        }
        const promises = especies.map(async especie => {
            const existeEspecie = await especiesModel.findOne({ Nombre: especie.name });

            if (!existeEspecie) {
                const nuevaEspecie = new especiesModel({
                    Nombre: especie.name,
                    Clasificacion: especie.classification,
                    Designacion: especie.designation,
                    Estatura: especie.average_height,
                    Color_de_piel: especie.skin_colors,
                    Color_de_cabello: especie.hair_colors,
                    Color_de_ojos: especie.eye_colors,
                    Promedio_de_vida: especie.average_lifespan,
                    Lenguaje: especie.language,
                });
                return nuevaEspecie.save();
            } else {
                console.log(`La especie ${especie.name} ya existe. No se guardará.`);
            }
        });
        await Promise.all(promises);
        console.log("Especies guardadas con éxito.");
        page++; 
    }
    } catch (error) {
        console.error("Error al llenar la base de datos: ", error.message);
    }
};
llenarBDespecies();






/////////////////////////////////////           Naves           ///////////////////////////////////////
const llenarBDnaves = async () => {
    try {
        let page = 1;
        let pagina = true;
        while (pagina) {
        const response = await axios.get(`https://swapi.dev/api/starships/?page=${page}`);
        const naves = response.data.results;

        if (naves.length === 0) {
            pagina = false; 
            break;
        }

        const promises = naves.map(async nave => {
        const existeNave = await NavesModel.findOne({ Nombre: nave.name });
            if (!existeNave) {
                const nuevanaves = new NavesModel({
                    Nombre: nave.name,
                    Modelo: nave.model,
                    Clase: nave.manufacturer, //CLASE?
                    Tamaño: nave.length, 
                    Numero_de_Pasajeros: nave.passengers,
                    Maxima_velocidad_atmosferica: nave.max_atmosphering_speed,
                    Hiperimpulsor: nave.hyperdrive_rating,
                    MGLT: nave.MGLT, 
                    Capacidad_de_carga: nave.cargo_capacity,
                    Tiempo_Maximo_Cobustibles: nave.consumables,
                });
                return nuevanaves.save();
            } else {
                console.log(`La nave ${nave.name} ya existe. No se guardará.`);
            }
        });
        await Promise.all(promises);
 
        console.log("Naves guardadas con éxito.");
        page++; 
    }
    } catch (error) {
        console.error("Error al llenar la base de datos: ", error.message);
    }
};

llenarBDnaves();




/////////////////////////////////////           Vehiculos           ///////////////////////////////////////
const llenarBDvehiculos = async () => {
    try {

        let page=1;
        let pagina = true;
        while (pagina) {
        const response = await axios.get(`https://swapi.dev/api/vehicles/?page=${page}`);
        const vehiculos = response.data.results;


        if (vehiculos.length === 0) {
            pagina = false; 
            break;
        }

        const promises = vehiculos.map(async vehiculo => {
        const existeVehiculo = await VehiculosModel.findOne({ Nombre: vehiculo.name });

            if (!existeVehiculo) {
                const nuevosvehiculos = new VehiculosModel({
                    Nombre: vehiculo.name,
                    Modelo: vehiculo.model,
                    Clase: vehiculo.vehicle_class,
                    Tamaño: vehiculo.length, 
                    Numero_de_Pasajeros: vehiculo.passengers,
                    Maxima_velocidad_atmosferica: vehiculo.max_atmosphering_speed,
                    Capacidad_Maxima: vehiculo.cargo_capacity,
                    Tiempo_Maximo_Cobustibles: vehiculo.consumables,
                });
                return nuevosvehiculos.save();
            } else {
                console.log(`El vehículo ${vehiculo.name} ya existe. No se guardará.`);
            }
        });
        await Promise.all(promises);
        console.log("Vehículos guardados con éxito.");
        page++; 
    }
    } catch (error) {
        console.error("Error al llenar la base de datos: ", error.message);
    }
};
llenarBDvehiculos();



/////////////////////////////////////       Personajes          ///////////////////////////////////////
    const llenarBDpersonajes = async () => {
        try {
            let page = 1;
            let pagina = true;
    
            while (pagina) {
                const response = await axios.get(`https://swapi.dev/api/people/?page=${page}`);
                const personajes = response.data.results;
    
                if (personajes.length === 0) {
                    pagina = false; 
                    break;
                }
                const promises = personajes.map(async personaje => {
                const existePersonaje = await PersonajesModel.findOne({ Nombre: personaje.name });
                    if (!existePersonaje) {
                        const nuevospersonajes = new PersonajesModel({
                            Nombre: personaje.name,
                            Fecha_Nacimiento: personaje.birth_year,
                            Color_Ojos: personaje.eye_color,
                            Genero: personaje.gender,
                            Color_Cabello: personaje.hair_color,
                            Altura: personaje.height,
                            Masa: personaje.mass,
                            Color_de_Piel: personaje.skin_color,
                        });
                        return nuevospersonajes.save();
                    } else {
                        console.log(`El personaje ${personaje.name} ya existe. No se guardará.`);
                    }
                });
    
                await Promise.all(promises);
                console.log(`Personajes de la página ${page} guardados con éxito.`);
                page++; 
            }
    
            console.log("Todos los personajes han sido procesados.");
        } catch (error) {
            console.error("Error al llenar la base de datos: ", error.message);
        }
    };
    
    llenarBDpersonajes();
    
