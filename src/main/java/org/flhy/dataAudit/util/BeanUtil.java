/**
 * @ProjectName: Antelope系统开发框架
 * @Copyright: 2010 ChongQing Hikvision System Technology Co., Ltd. All Right Reserved.
 * @address: http://www.hikvision.com
 * @date: 2012-3-27 上午09:39:20
 * @Description: 本内容仅限于重庆海康威视系统技术有限公司内部使用，禁止转发.
 */
package org.flhy.dataAudit.util;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.sql.Date;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;

import org.apache.commons.lang.StringUtils;

/**
 * 提供对象与Map的相互转换
 * @author jiangbocqxt
 *
 */
public final class BeanUtil {
	
	/**
	 * 将bean 转换为map对象
	 * @author Lv Bingfeng 2012-10-12 下午03:26:40
	 * @param bean
	 * @return
	 */
	public static Map<String, Object> describe(Object bean) {
		Map<String, Object> result = new HashMap<String, Object>();
		if (bean == null) {
			return result;
		}
		Class<?> beanClass = bean.getClass();
		Method[] beanMethods = beanClass.getMethods();
		for (Method method : beanMethods) {
			String methodName = method.getName();
			if (methodName.startsWith("get") && methodName.length() > 3 && !"getClass".equals(methodName)) {
				String key = StringUtils.uncapitalize(methodName.substring(3));
				Object value = null;
				try {
					value = method.invoke(bean);
				} catch (Exception e) {
					e.printStackTrace();
				}
				result.put(key, value);
			}
		}
		return result;
	}
	
	/**
	 * 将bean 转换为map对象
	 * @author Lv Bingfeng 2012-10-12 下午03:26:40
	 * @param bean
	 * @return
	 */
	public static Map<String, String> describeStr(Object bean) {
		Map<String, String> result = new HashMap<String, String>();
		if (bean == null) {
			return result;
		}
		Class<?> beanClass = bean.getClass();
		Method[] beanMethods = beanClass.getMethods();
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		for (Method method : beanMethods) {
			String methodName = method.getName();
			if (methodName.startsWith("get") && methodName.length() > 3 && !"getClass".equals(methodName)) {
				String key = StringUtils.uncapitalize(methodName.substring(3));
				Object value = null;
				try {
					value = method.invoke(bean);
				} catch (Exception e) {
					e.printStackTrace();
				}
				if (value == null) {
					result.put(key, null);
				} else if (java.util.Date.class.isAssignableFrom(value.getClass())) {
					result.put(key, format.format((java.util.Date)value));
				} else {
					result.put(key, value.toString());
				}
				
			}
		}
		return result;
	}
	
	/**
	 * 属性拷贝（不拷贝空字段）
	 * @author Chen Junpeng 2011-5-30 上午11:01:50
	 * @param source 源类
	 * @param target 目标类
	 */
	public static void copyProperties(Object source, Object target) {
		copyProperties(source, target, Type.NOT_BLANK);
	}
	
	/**
	 * 属性拷贝（空值也进行拷贝）,双引号也拷贝
	 * @author caoyi 2014-7-22 上午10:08:32
	 * @param source 源类
	 * @param target 目标类
	 */
	public static void copyPropertiesIncludeEmpty(Object source, Object target) {
		copyProperties(source, target, Type.EMPLAY);
	}
	
	public enum Type {
		 NULL,//包含null,不包含 n个空格
		 EMPLAY,//可以包含 n个空格，不包含null
		 BLANK,//可以包含 n个空格，包含null
		 NOT_BLANK//不包含 n个空格，不包含null 
	}
	
	/**
	 * 简单复制
	 * @author Yang Guanlin 2015-11-27 下午02:53:51
	 * @param source
	 * @param target
	 * @param type
	 */
	public static void copyProperties(Object source, Object target, Type type) {
		Class<?> targetCT = target.getClass();
		Class<?> sourceCT = source.getClass();
		
		Method[] targetMethods = targetCT.getMethods();
		Method[] sourceMethods = sourceCT.getMethods();
		
		String methodName = null;
		String getMethod = null;
		Object getVal = null;
		Object[] paramsValue = null;
		
		for (Method method : targetMethods) {
			methodName = method.getName();
			if ("set".equals(methodName.substring(0, 3))) {
				getMethod = "get" + methodName.substring(3);
				for (Method m : sourceMethods) {
					// 判断源类中是否有同样的get方法
					if (m.getName().equals("get" + methodName.substring(3))) {
						try {
							getVal = sourceCT.getMethod(getMethod).invoke(source);
							if (null == getVal) {
								if (Type.NULL.equals(type)||Type.BLANK.equals(type)) {
									paramsValue = new Object[] {getVal};
									method.invoke(target, paramsValue);
								}
								break;
							}
							if (StringUtils.isBlank(getVal.toString())) {
								if (Type.EMPLAY.equals(type)||Type.BLANK.equals(type)) {
									paramsValue = new Object[] {getVal};
									method.invoke(target, paramsValue);
								}
								break;
							}
							paramsValue = new Object[] {getVal};
							method.invoke(target, paramsValue);
							break;
						} catch (Exception e) {
							e.printStackTrace();
						}
					}
				}
			}
		}
	}
//	public static void main(String[] args) {
//		// 目标类的所有字段
//		Field[] fields = AsjXs.class.getDeclaredFields();
//		for (Field targetField : fields) {
//			targetField.setAccessible(true);
//			String targetFieldName = targetField.getName();
//			System.out.println(
//					"private:"+Modifier.isPrivate(targetField.getModifiers())+"" +
//					"|public:"+Modifier.isPublic(targetField.getModifiers())+"" +
//					"|static:"+Modifier.isStatic(targetField.getModifiers())+"" +
//					"|final:"+Modifier.isFinal(targetField.getModifiers())+"="+targetFieldName);
//		}
//    }
	/**
	 * 复制字段
	 * @author Yang Guanlin 2015-11-27 下午03:41:58
	 * @param source
	 * @param target
	 * @param type
	 * @throws IllegalArgumentException
	 * @throws IllegalAccessException
	 * @throws ParseException
	 */
	public static void copyFieldVlue(Object source, Object target, Type type) throws IllegalArgumentException,
	        IllegalAccessException, ParseException {
		if (null != target) {
			// 目标类的所有字段
			Field[] fields = target.getClass().getDeclaredFields();
			for (Field targetField : fields) {
				targetField.setAccessible(true);
				String targetFieldName = targetField.getName();
				//排除 static  和 final的字段
				if(Modifier.isStatic(targetField.getModifiers())||Modifier.isFinal(targetField.getModifiers())){
					continue;
				}
				// 源类的所有字段
				Field[] sourceFields = source.getClass().getDeclaredFields();
				for (Field sourceField : sourceFields) {
					sourceField.setAccessible(true);
					String sourceFieldName = sourceField.getName();
					// 四种情况全兼容，以最先匹配为准
					if (sourceFieldName.equals(targetFieldName)) {
						copyValue(source,sourceField, target,targetField, type);
						break;
					}
				}
				
			}
		}
	}

	public static void copyValue(Object source, Field sourceField, Object target,Field targetField, Type type)
            throws IllegalAccessException, ParseException {
		//排除 static  和 final的字段
		if(Modifier.isStatic(targetField.getModifiers())||Modifier.isFinal(targetField.getModifiers())){
			return;
		}
		sourceField.setAccessible(true);
		targetField.setAccessible(true);
		Class souceCazz = sourceField.getType();
	    Class targetCazz = targetField.getType();
	    Object value = sourceField.get(source);
	    
	    if (null == value) {
	    	if (Type.NULL.equals(type)||Type.BLANK.equals(type)) {
	    		targetField.set(target, value);
	    	}
	    }else if (StringUtils.isBlank(value.toString()) && java.lang.String.class == souceCazz) {
	    	if (Type.EMPLAY.equals(type)||Type.BLANK.equals(type)) {
	    		if(java.lang.String.class == targetCazz){
	    			targetField.set(target, value);
	    		}else{
	    			//类型不匹配，这是就不能设置了。比如类型为double  设置""，就会报错
	    			targetField.set(target, null);
	    		}
	    	}
	    }else if (souceCazz == targetCazz) {
	    	// 表示匹配了
	    	targetField.set(target, value);
	    } else {
	    	// 一些类型不匹配
	    	if (java.lang.String.class == targetCazz) {
	    		targetField.set(target, value.toString());
	    	}
	    	if (java.lang.Integer.class == targetCazz && java.lang.String.class == souceCazz) {
	    		targetField.set(target, Integer.valueOf(value.toString()));
	    	}
	    	if (java.util.Date.class == targetCazz && java.lang.String.class == souceCazz) {
	    		targetField.set(target, new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(value.toString()));
	    	}
	    	if (java.lang.Double.class == targetCazz && java.lang.String.class == souceCazz) {
	    		targetField.set(target, Double.valueOf((String)value));
	    	}
	    	if (java.lang.Long.class == targetCazz && java.lang.String.class == souceCazz) {
	    		targetField.set(target, Long.valueOf((String)value));
	    	}
	    }
    }
	
	/**
	 * 属性拷贝 忽略属性的大小写
	 * @author Yang Guanlin 2014-5-21 下午03:09:43
	 * @param source
	 * @param target
	 */
	public static void copyPropertiesIgnoreCase(Object source, Object target) {
		Class<?> targetCT = target.getClass();
		Class<?> sourceCT = source.getClass();
		
		Method[] targetMethods = targetCT.getMethods();
		Method[] sourceMethods = sourceCT.getMethods();
		
		String methodName = null;
		Object getVal = null;
		Object[] paramsValue = null;
		
		for (Method method : targetMethods) {
			methodName = method.getName();
			if ("set".equals(methodName.substring(0, 3))) {
				for (Method m : sourceMethods) {
					// 判断源类中是否有同样的get方法
					if (m.getName().equalsIgnoreCase("get" + methodName.substring(3))) {
						try {
							String sourceGetMethodName = "get" + m.getName().substring(3);
							getVal = sourceCT.getMethod(sourceGetMethodName).invoke(source);
							// 存在空值不进行copy
							// if (null != getVal && StringUtil.isNotBlank(getVal.toString())) {
							// 为了适应S80客户端传入的时间字段
							Class[] paramType = method.getParameterTypes();
							// if (paramType[0] == java.util.Date.class) {
							// // set(Date d)
							// getVal = new SimpleDateFormat("yyyy-mm-dd HH:mm:ss").parse(getVal.toString());
							// }
							paramsValue = new Object[] {getVal};
							method.invoke(target, paramsValue);
							// }
						} catch (Exception e) {
							e.printStackTrace();
						}
					}
				}
			}
		}
	}
	
	public static void populate(Object bean, Map<String, ? extends Object> m) throws IllegalArgumentException,
	        InvocationTargetException, IllegalAccessException {
		Class<?> beanClass = bean.getClass();
		Method[] beanMethods = beanClass.getMethods();
		for (Method method : beanMethods) {
			String methodName = method.getName();
			if (methodName.startsWith("set") && methodName.length() > 3 && !"getClass".equals(methodName)) {
				String key = StringUtils.uncapitalize(methodName.substring(3));
				Object value = m.get(key);
				if (value == null) {
					continue;
				}
				
				Object dateValue = DateUtil.stringToDate(value.toString());
				if (null == dateValue) {
					dateValue = DateUtil.stringToDate(value.toString());
				}
				
				if (null != dateValue) {
					if (method.getParameterTypes()[0].isAssignableFrom(dateValue.getClass())) {
						method.invoke(bean, dateValue);
					} else if (method.getParameterTypes()[0].isAssignableFrom(value.getClass())) {
						method.invoke(bean, value);
					}
				} else {
					if (method.getParameterTypes()[0].isAssignableFrom(value.getClass())) {
						method.invoke(bean, value);
					}
				}
			}
		}
	}
	



}
