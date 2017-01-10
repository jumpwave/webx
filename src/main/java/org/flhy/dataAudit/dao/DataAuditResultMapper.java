package org.flhy.dataAudit.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.flhy.dataAudit.domain.DataAuditResult;
import org.springframework.stereotype.Repository;
@Repository
public interface DataAuditResultMapper {
	public DataAuditResult getDataAuditResult(String result_id);
	public List<DataAuditResult> findDataAuditResult(DataAuditResult dataAuditResult);
	public void insertDataAuditResult(DataAuditResult dataAuditResult);
	public void updateDataAuditResult(DataAuditResult dataAuditResult);
	public void delete(List<String> taskIds);
	public List<DataAuditResult> pageDataAuditResult(@Param("dataAuditResult") DataAuditResult dataAuditResult, @Param("timeMin") String timeMin,  @Param("timeMax") String timeMax, 
			@Param("pageNum") int pageNum,  @Param("pageSize") int pageSize);
}
