class Campers {
    constructor(){
        this.campers = []
    }

    putCamper(id, username, camp){
        var user = {
            id,
            username,
            camp
        }
        for(var i=0; i<this.campers.length; ++i){
            if(this.campers[i].username === username){
                return
            }
        }
        this.campers.push(user)
        return
    }

    getCampers(camp){
        var campersInDiscuss = []
        for(var index=0; index<this.campers.length; ++index){
            if(this.campers[index].camp === camp){
                campersInDiscuss.push(this.campers[index].username)
            }
        }
        return campersInDiscuss
    }

    getCamperById(id){
        for(var index=0; index<this.campers.length; ++index){
            if(this.campers[index].id === id){
                return this.campers[index].username 
            }
        }
        return
    }

    removeCamperById(id){
        var camper = this.getCamperById(id)
        if(camper){
            this.campers = this.campers.filter((c)=>c.id !== id)
        }
        return camper
    }

}

module.exports = {Campers}