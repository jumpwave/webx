package org.flhy.exception;

import java.util.List;

import org.flhy.dataAudit.bo.ResultResponse;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

@ControllerAdvice
public class MethodArgumentNotValidExceptionHandler {
	public static final String EXCEP = "参数异常";
	@ExceptionHandler(value = MethodArgumentNotValidException.class)
	public @ResponseBody ResultResponse callExceptionHandler(MethodArgumentNotValidException ex){
		ResultResponse rr = ResultResponse.getSuccess();
		rr.setRet(ResultResponse.RET_FAIL);	
		rr.setMsg(EXCEP);
		BindingResult bindResult = ex.getBindingResult();
        List<ObjectError> errors = bindResult.getAllErrors();
        if(errors.size()>0){
            StringBuilder msg = new StringBuilder();
            for(ObjectError error :errors){
                msg.append(error.getDefaultMessage());
                msg.append("\n");
            }
            rr.setMsg(msg.toString());	
        }
        
		return rr;
	}
}
