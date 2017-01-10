package org.flhy.dataAudit.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value=HttpStatus.NOT_FOUND,reason="数据稽核任务未找到")
public class DataAuditTaskNotFoundException extends RuntimeException{
}
