 class AuditLogDTO {
   
        
    
        constructor ( timestamp,  userId,  action,  entity) {
            this.timestamp = timestamp;
            this.userId = userId;
            this.action = action;
            this.entity = entity;
        }
    
}

export default  AuditLogDTO;