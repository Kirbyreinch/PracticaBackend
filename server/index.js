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


///////////////////////////////////////////Peliculas  CRUD///////////////////////////////////////////
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


/////////////////////////////////////LLENADO BD///////////////////////////////////////
/////////////////////////////////////Peliculas///////////////////////////////////////
const llenarBDpeliculas = async () => {
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
llenarBDpeliculas();



/////////////////////////////////////Planetas///////////////////////////////////////
const llenarBDplanetas = async () => {
    try {
        const response = await axios.get('https://swapi.dev/api/planets/');
        const planetas = response.data.results; 
        const promises = planetas.map(planeta => {
            const nuevoPlaneta = new PlanetasModel({
                Nombre: planeta.name, 
                Diametro: planeta.diameter, 
                Periodo_Rotacion : planeta.rotation_period , 
                Periodo_Orbital: planeta.orbital_period, 
                Gravedad: planeta.gravity, 
                Poblacion: planeta.population, 
                Clima: planeta.climate, 
                Terreno: planeta.terrain, 
                Superficie_Agua: planeta.surface_water, 
            });
            return nuevoPlaneta.save();
        });
        await Promise.all(promises); 
        console.log("Planetas guardados con éxito.");
    } catch (error) {
        console.error("Errores al llenar la base de datos: ", error.message);
    }
};
llenarBDplanetas();


/////////////////////////////////////Especies///////////////////////////////////////
const llenarBDespecies = async () => {
    try {
        const response = await axios.get('https://swapi.dev/api/species/');
        const especies = response.data.results; 
        const promises = especies.map(especie => {
            const nuevaEspecie = new especiesModel({
                Nombre: especie.name, 
                Clasificacion: especie.classification, 
                Designacion : especie.designation , 
                Estatura: especie.average_height, 
                Promedio_de_vida: especie.average_lifespan, 
                Color_de_ojos: especie.eye_colors, 
                Color_de_cabello: especie.hair_colors, 
                Color_de_piel: especie.skin_colors, 
                Lenguaje: especie.language, 
            });
            return nuevaEspecie.save();
        });
        await Promise.all(promises); 
        console.log("Especies guardadas con éxito.");
    } catch (error) {
        console.error("Error al llenar la base de datos: ", error.message);
    }
};
llenarBDespecies();





/////////////////////////////////////Naves///////////////////////////////////////
const llenarBDnaves = async () => {
    try {
        const response = await axios.get('https://swapi.dev/api/starships/');
        const naves = response.data.results; 
        const promises = naves.map(nave => {
            const nuevanaves = new NavesModel({
                Nombre: nave.name, 
                Modelo: nave.model, 
                Clase : nave. manufacturer, //Clase?
                Tamaño: nave.lenght, 
                Numero_de_Pasajeros: nave.passengers, 
                Maxima_velocidad_atmosferica: nave.max_atmosphering_speed, 
                Hiperimpulsor: nave.hyperdrive_rating, 
                MGTL: nave.MGTL, 
                Capacidad_de_carga: nave.cargo_capacity, 
                Tiempo_Maximo_Cobustibles: nave.consumables, 
            });
            return nuevanaves.save();
        });
        await Promise.all(promises); 
        console.log("Naves guardadas con éxito.");
    } catch (error) {
        console.error("Error al llenar la base de datos: ", error.message);
    }
};
llenarBDnaves();



/////////////////////////////////////Vehiculos///////////////////////////////////////
const llenarBDvehiculos = async () => {
    try {
        const response = await axios.get('https://swapi.dev/api/vehicles/');
        const vehiculos = response.data.results; 
        const promises = vehiculos.map(vehiculo => {
            const nuevosvehiculos = new VehiculosModel({
                Nombre: vehiculo.name, 
                Modelo: vehiculo.model, 
                Clase : vehiculo. vehicle_class, 
                Tamaño: vehiculo.lenght, 
                Numero_de_Pasajeros: vehiculo.passengers, 
                Maxima_velocidad_atmosferica: vehiculo.max_atmosphering_speed, 
                Capacidad_Maxima: vehiculo.cargo_capacity, 
                Tiempo_Maximo_Cobustibles: vehiculo.consumables, 
            });
            return nuevosvehiculos.save();
        });
        await Promise.all(promises); 
        console.log("Vehiculos guardados con éxito.");
    } catch (error) {
        console.error("Error al llenar la base de datos: ", error.message);
    }
};
llenarBDvehiculos();




/////////////////////////////////////Personajes///////////////////////////////////////
const llenarBDpersonajes = async () => {
    try {
        const response = await axios.get('https://swapi.dev/api/people/');
        const personajes = response.data.results; 
        const promises = personajes.map(personajes => {
            const nuevospersonajes = new PersonajesModel({
                Nombre: personajes.name, 
                Fecha_Nacimiento: personajes.birth_year, 
                Color_Ojos : personajes. eye_color, 
                Genero: personajes.gender, 
                Color_Cabello: personajes.hair_color, 
                Altura: personajes.height, 
                Masa: personajes.mass, 
                Color_de_Piel: personajes.skin_color, 
            });
            return nuevospersonajes.save();
        });
        await Promise.all(promises); 
        console.log("Personajes guardados con éxito.");
    } catch (error) {
        console.error("Error al llenar la base de datos: ", error.message);
    }
};
llenarBDpersonajes();