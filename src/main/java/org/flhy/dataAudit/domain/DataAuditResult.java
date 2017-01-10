package org.flhy.dataAudit.domain;

import java.io.Serializable;

public class DataAuditResult implements Serializable{
	protected String result_id;
	protected String task_id;
	protected String begin_time;
	protected String end_time;
	protected String has_exception;
	
	protected String exception_headers;
	protected String exceptions;
	protected String audit_script;
	public String getResult_id() {
		return result_id;
	}
	public void setResult_id(String result_id) {
		this.result_id = result_id;
	}
	public String getTask_id() {
		return task_id;
	}
	public void setTask_id(String task_id) {
		this.task_id = task_id;
	}
	public String getBegin_time() {
		return begin_time;
	}
	public void setBegin_time(String begin_time) {
		this.begin_time = begin_time;
	}
	public String getEnd_time() {
		return end_time;
	}
	public void setEnd_time(String end_time) {
		this.end_time = end_time;
	}

	public String getHas_exception() {
		return has_exception;
	}
	public void setHas_exception(String has_exception) {
		this.has_exception = has_exception;
	}
	public String getException_headers() {
		return exception_headers;
	}
	public void setException_headers(String exception_headers) {
		this.exception_headers = exception_headers;
	}
	public String getExceptions() {
		return exceptions;
	}
	public void setExceptions(String exceptions) {
		this.exceptions = exceptions;
	}
	public String getAudit_script() {
		return audit_script;
	}
	public void setAudit_script(String audit_script) {
		this.audit_script = audit_script;
	}
	
	
	
}