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


///////////////////////////////////////////Peliculas///////////////////////////////////////////
app.post("/Peliculas", async (req, res) => {
    try {
        const nuevapeli = new PelisModel(req.body);
        const guardarpeli = await nuevapeli.save();
        res.status(201).send(guardarpeli);
    } catch (error) {
        res.status(400).send("Error al crear Pelicula: " + error.message);
    }
});
app.get("/Peliculas/:id", async (req, res) => {
    try {
        const id = req.params.id; 
        const pelis = await PelisModel.findById(id); 
        if (!pelis) {
            return res.status(404).send("Pelicula no encontrado");
        }
        res.send(pelis);
    } catch (error) {
        res.status(400).send("Error al obtener Pelicula: " + error.message);
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
        const updatedPelis = await PelisModel.findByIdAndUpdate(id, req.body, { new: true });
        res.send({ message: "Pelicula Modificada", pelicula: updatedPelis });
    } catch (error) {
        res.status(400).send("Error al modificar Pelicula: " + error.message);
    }

});


const llenarBD = async () => {
    try {
        const response = await axios.get('https://swapi.dev/api/films/');
        const peliculas = response.data.results; // Asegúrate de que esto sea un array
        
        const promises = peliculas.map(peli => {
            const nuevaPeli = new PelisModel({
                Titulo: peli.title, // Cambia esto si la propiedad tiene un nombre diferente
                Director: peli.director,
                Productor: peli.producer,
            });
            return nuevaPeli.save();
        });

        await Promise.all(promises); // Esperar a que todas las películas se guarden
        console.log("Películas guardadas con éxito.");
    } catch (error) {
        console.error("Error al llenar la base de datos: ", error.message);
    }
};
// Llenar la base de datos al iniciar el servidor
llenarBD();



/////////////////////////////////////Planetas///////////////////////////////////////
const llenarBDplanetas = async () => {
    try {
        const response = await axios.get('https://swapi.dev/api/planets/');
        const planetas = response.data.results; 
        
        const promises = planetas.map(planeta => {
            const nuevoPlaneta = new PlanetasModel({
                Nombre: planeta.name, // Correcto
                Diametro: planeta.diameter, // Correcto
                Periodo_Rotacion : planeta.rotation_period , // Corrige 'robital_period' a 'rotation_period'
                Periodo_Orbital: planeta.orbital_period, // Cambia 'gravity' a 'orbital_period'
                Gravedad: planeta.gravity, // Correcto
                Poblacion: planeta.population, // Correcto
                Clima: planeta.climate, // Correcto
                Terreno: planeta.terrain, // Correcto
                Superficie_Agua: planeta.surface_water, // Correcto
            });
            return nuevoPlaneta.save();
        });

        await Promise.all(promises); 
        console.log("Planetas guardados con éxito.");
    } catch (error) {
        console.error("Error al llenar la base de datos: ", error.message);
    }
};

// Llama a la función al iniciar el servidor
llenarBDplanetas();








