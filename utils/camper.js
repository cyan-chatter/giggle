const { authenticate } = require("passport")

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

    getCamperById(verifier){
        var verifiedCamper = this.campers.filter((authenticate)=>{
            return authenticate.id === verifier
        })[0]
        return verifiedCamper
        
        // for(var index=0; index<this.campers.length; ++index){
        //     if(this.campers[index].id === id){
        //         return this.campers[index].username 
        //     }
        // }
        //return
    }

    removeCamperById(verifier){
        var camper = this.getCamperById(verifier)
        if(camper){
            this.campers = this.campers.filter((c)=>c.verifier !== verifier)
        }
        return camper
    }

}

module.exports = {Campers}