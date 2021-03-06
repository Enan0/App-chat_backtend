const mensajeModel = require('../model/mensajes');
const chatModel = require('../model/chats');
const mensajeController = {}

//DEV TOOL
mensajeController.viewAllMensajes = async (req, res) => {
    /*Vemos todos los mensajes */
    const mensajes = await mensajeModel.find();
    res.json(mensajes);
}
mensajeController.viewMensajesEnChat = async (req, res) => {
    //1) Buscamos el chat
    const chat = await chatModel.findById(req.params.chat) //->Busca el chat por id pasada por params
    //2) Buscamos los mensajes que correspondan al chat
    const mensajesDelChat = await mensajeModel.find({ chat });
    res.json(mensajesDelChat);
}

mensajeController.getTextoChat = async (req, res) => {
    /*Obtiene solo el texto y usuario del mensaje */
    const chat = await chatModel.findById(req.params.chat);
    const mensajes = await mensajeModel.find({ chat });
    let textoMensajes = [];
    mensajes.forEach(msg => { 
        textoMensajes.push({usuario:msg.usuario,texto:msg.texto})
    })
    res.json(textoMensajes)

}

mensajeController.createMensaje = async (req, res) => {
    /*Crea un mensaje */
    const { texto } = req.body;
    const mensaje = new mensajeModel({
        texto
    });
    await mensaje.save()
        .then(res.json({ status: "mensaje creado" }))
        .catch((err) => { res.json({ ERROR: err.message }); });


}


mensajeController.createMensajesEnChat = async (req, res) => {
    //1)Buscar el chat
    const chat = await chatModel.findById(req.params.chat);
    //2)Crear el mensaje
    //Requerimos los datos del form
    const { texto } = req.body;
    const mensaje = new mensajeModel({ chat, texto });
    await mensaje.save()
        .then(() => {
            //3)Guardar mensaje en el chat
            chat.mensajes.push({ mensaje: mensaje })
            //4)Persistimos
            chat.save()
                .then(res.json({ status: "mensaje enviado al chat" }))
                .catch((err) => { res.json({ ERROR: err.message }); });
        })
}



module.exports = mensajeController;