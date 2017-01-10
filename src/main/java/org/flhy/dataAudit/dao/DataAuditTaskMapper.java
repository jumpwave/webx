package org.flhy.dataAudit.dao;

import java.util.List;

import org.flhy.dataAudit.domain.DataAuditTask;
import org.springframework.stereotype.Repository;

@Repository
public interface DataAuditTaskMapper {
	public DataAuditTask getDataAuditTask(String task_id);
	public List<DataAuditTask> findDataAuditTask();
	public void insertDataAuditTask(DataAuditTask task);
	public void updateDataAuditTask(DataAuditTask task);
	public void delete(List<String> taskIds);
	
	
}
