 class BudgetDetailsDTO {
    

    constructor(id, name, availableBudget, owner, manager, finance, timestamp, approved) {
        this.id = id;
        this.name = name;
        this.availableBudget = availableBudget;
        this.owner = owner;
        this.finance = finance;
        this.manager = manager;
        this.timestamp = timestamp;
        this.approved = approved;

    
    }
    
}
export default BudgetDetailsDTO;
