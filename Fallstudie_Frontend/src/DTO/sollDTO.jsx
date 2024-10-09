 class sollDTO {

    constructor(id, name, betrag, timestamp, budgetId, user){
        this.id = id;
        this.name = name;
        this.betrag = betrag;
        this.timestamp = timestamp;
        this.budgetId = budgetId;
        this.userId = user;// ID des Users, der die Änderung vorgenommen hat
    }
}
export default sollDTO;
