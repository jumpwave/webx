package org.flhy.exception;

import java.lang.reflect.Method;

import org.flhy.dataAudit.bo.ResultResponse;
import org.flhy.log.MethodTitle;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

@ControllerAdvice
public class AppWideExceptionHandler {
	public static final String EXCEP = "异常";
	@ExceptionHandler(value = CallException.class)
	public @ResponseBody ResultResponse callExceptionHandler(CallException ce){
		String msg = EXCEP;
		ResultResponse rr = ResultResponse.getSuccess();
		rr.setRet(ResultResponse.RET_FAIL);
		StackTraceElement ste = ce.getStackTrace()[0];
		String clazz = ste.getClassName(); 
		String meth = ste.getMethodName();
	    Class targetClass = null;
		try {
			targetClass = Class.forName(clazz);
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
	    Method[] methods = targetClass.getMethods();
        for  (Method method : methods) { 
            if  (method.getName().equals(meth)) {  //没能区别重载方法
            	MethodTitle anno = AnnotationUtils.findAnnotation(method, MethodTitle.class);
            	msg = anno.value() + msg;
            	break;
            }
        }	    
        rr.setMsg(msg);
		return rr;
	}
}
