package org.flhy.dataAudit.domain;

import java.io.Serializable;
import java.util.List;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class DataAuditTask implements Serializable {
	protected String task_id;
	
	@NotNull(message="任务名称不为空")
	@Size(min=1 ,max=100, message="任务名称长度不超过100")
	protected String task_name;
	protected String task_target;
	@NotNull
	protected String first_execute_time;
	@NotNull
	protected String execute_times;
	protected String execute_interval;
	protected String execute_interval_unit;
	@NotNull
	protected String data_source;
	@NotNull
	@Size(min=1 ,max=3000, message="任务脚本长度不超过3000")
	protected String audit_script;
	protected List<DataAuditScriptParam> script_params;
	public String getTask_id() {
		return task_id;
	}
	public void setTask_id(String task_id) {
		this.task_id = task_id;
	}
	public String getTask_name() {
		return task_name;
	}
	public void setTask_name(String task_name) {
		this.task_name = task_name;
	}
	public String getTask_target() {
		return task_target;
	}
	public void setTask_target(String task_target) {
		this.task_target = task_target;
	}
	public String getFirst_execute_time() {
		return first_execute_time;
	}
	public void setFirst_execute_time(String first_execute_time) {
		this.first_execute_time = first_execute_time;
	}
	public String getExecute_times() {
		return execute_times;
	}
	public void setExecute_times(String execute_times) {
		this.execute_times = execute_times;
	}
	public String getExecute_interval() {
		return execute_interval;
	}
	public void setExecute_interval(String execute_interval) {
		this.execute_interval = execute_interval;
	}
	public String getExecute_interval_unit() {
		return execute_interval_unit;
	}
	public void setExecute_interval_unit(String execute_interval_unit) {
		this.execute_interval_unit = execute_interval_unit;
	}
	public String getData_source() {
		return data_source;
	}
	public void setData_source(String data_source) {
		this.data_source = data_source;
	}
	public String getAudit_script() {
		return audit_script;
	}
	public void setAudit_script(String audit_script) {
		this.audit_script = audit_script;
	}
	public List<DataAuditScriptParam> getScript_params() {
		return script_params;
	}
	public void setScript_params(List<DataAuditScriptParam> script_params) {
		this.script_params = script_params;
	}
	
}
