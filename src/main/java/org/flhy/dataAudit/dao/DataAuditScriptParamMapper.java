package org.flhy.dataAudit.dao;

import java.util.List;

import org.flhy.dataAudit.domain.DataAuditScriptParam;
import org.springframework.stereotype.Repository;
@Repository
public interface DataAuditScriptParamMapper {
	public DataAuditScriptParam getDataAuditScriptParam(String param_id);
	public List<DataAuditScriptParam> findDataAuditScriptParam(DataAuditScriptParam dataAuditScriptParam);
	public List<DataAuditScriptParam> findDataAuditScriptParamByTask(String task_id);
	public void insertDataAuditScriptParam(DataAuditScriptParam dataAuditScriptParam);
	public void updateDataAuditScriptParam(DataAuditScriptParam dataAuditScriptParam);
	public void delete(List<String> taskIds);
}
