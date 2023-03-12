import messagesModel from '../models/messages.models.js'

class MessagesManager{
    constructor(user){
        this.user = user,
        this.messages = []
    }

    addMessage = async (user, message) => {
        await messagesModel.create({
            user: user,
            message: message
        })
    }
}

export default MessagesManager