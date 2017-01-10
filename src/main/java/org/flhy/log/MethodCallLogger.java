package org.flhy.log;

import java.lang.reflect.Method;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class MethodCallLogger {
	private static final Logger LOG = LoggerFactory.getLogger(MethodCallLogger.class);
	@Pointcut("execution(* org.flhy.dataAudit.service.*.*(..))")  
	public void methodLog(){}
	
	@Before("methodLog()")
	public void beforeMethodCall(JoinPoint joinPoint) throws Exception{
		String targetName = joinPoint.getTarget().getClass().getName();
		
		String methodName = joinPoint.getSignature().getName();
		//获取操作内容  
		String opContent = optionContent(joinPoint.getArgs(), methodName);  		
		String methodTitle = this.getServiceMthodDescription(joinPoint);		
		LOG.info("【进入】{}{}.{}调用,{}",methodTitle,targetName,methodName,opContent);
	}
	
	@After("methodLog()")
	public void afterMethodCall(JoinPoint joinPoint)throws Exception{
		String targetName = joinPoint.getTarget().getClass().getName();
		String methodName = joinPoint.getSignature().getName();
		String methodTitle = this.getServiceMthodDescription(joinPoint);
		
		LOG.info("【离开】{}{}.{}调用",methodTitle,targetName,methodName);
	}
	
	/**
	 * 使用Java反射来获取被拦截方法(insert、update)的参数值，
	 * 将参数值拼接为操作内容
	 */
	public String optionContent(Object[] args, String mName) throws Exception{
		if (args == null) {
			return null;
		}	
		StringBuffer rs = new StringBuffer();
		//rs.append(mName);
		String className = null;
		int index = 1;
		// 遍历参数对象
		for (Object info : args) {		
			//获取对象类型
			className = info.getClass().getName();
			className = className.substring(className.lastIndexOf(".") + 1);
			rs.append("[参数" + index + "，类型：" + className + "，值：");		
			// 获取对象的所有方法
			Method[] methods = info.getClass().getDeclaredMethods();			
			// 遍历方法，判断get方法
			for (Method method : methods) {				
				String methodName = method.getName();
				// 判断是不是get方法
				if (methodName.indexOf("get") == -1) {// 不是get方法
					continue;// 不处理
				}				
				Object rsValue = null;
				try {					
					// 调用get方法，获取返回值
					rsValue = method.invoke(info);					
					if (rsValue == null) {//没有返回值
						continue;
					}					
				} catch (Exception e) {
					continue;
				}				
				//将值加入内容中
				rs.append("(" + methodName + " : " + rsValue + ")");
			}			
			rs.append("]");			
			index++;
		}
		
		return rs.toString();
	}	
	
    public  static  String getServiceMthodDescription(JoinPoint joinPoint) 
            throws  Exception { 
	     String targetName = joinPoint.getTarget().getClass().getName();
	     String methodName = joinPoint.getSignature().getName();
	     Object[] arguments = joinPoint.getArgs();
	     Class targetClass = Class.forName(targetName);
	     Method[] methods = targetClass.getMethods();
	     String description = "";
	        for  (Method method : methods) { 
	            if  (method.getName().equals(methodName)) { 
	             Class[] clazzs = method.getParameterTypes();
	                if  (clazzs.length == arguments.length) { 
	                	MethodTitle anno = method.getAnnotation(MethodTitle.class );
	                	if(null != anno){
	                		 description = anno.value(); 
	                	}
	                 
	                    break ; 
	             }
	         }
	     }
        return  description; 
 }	
}
