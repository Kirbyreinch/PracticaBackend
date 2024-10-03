
app.get("/Personajes/id/:id", async (req, res) => {
    try {
        const id = req.params.id; 
        const modelo = await PersonajesModel.findById(id, {createdAt: 0, updatedAt: 0}); 
        if (!modelo) {
            return res.status(404).send("Personaje no encontrado");
        }
        res.send(modelo);
    } catch (error) {
        res.status(400).send("Error al obtener especie: " + error.message);
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
        res.status(400).send("Error al obtener especie: " + error.message);
    }
});


app.get("/Personajes/modulo/", async (req, res) => {
    try {
        const modelo = await PersonajesModel.find({}, {createdAt: 0, updatedAt: 0}); 
        if (modelo.length === 0) {
            return res.status(404).send("Personaje no encontrado");
        }
        res.send(modelo);
    } catch (error) {
        res.status(400).send("Error al obtener especie: " + error.message);
    }
});




app.get("/Personajes/:id", async (req, res) => {
    try {
        const id = req.params.id; 
        const modelo = await PersonajesModel.findById(id); 
        if (!modelo) {
            return res.status(404).send("Personaje no encontrado");
        }
        res.send(modelo);
    } catch (error) {
        res.status(400).send("Error al obtener Personaje: " + error.message);
    }
});