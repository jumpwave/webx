   
package org.flhy.dataAudit.util;
   import java.sql.PreparedStatement;
   import java.util.HashMap;
   import java.util.Map;
   import java.util.Map.Entry;
   import java.util.regex.Matcher;
   import java.util.regex.Pattern;
   import org.apache.commons.logging.Log;
   import org.apache.commons.logging.LogFactory;
   /**
    * 用来模拟实现命名参数功能
    * <br/>
    * 编码：wallimn　时间：2009-1-8　下午12:11:34<br/>
    * 版本：V1.0<br/>
    */
   public class NamedParamSqlUtil {
       static final Log log = LogFactory.getLog(NamedParamSqlUtil.class);
       private Map<Integer,String> paramsMap=new HashMap<Integer,String>();
       
       public Map<Integer,String> getParamsMap(){
           return paramsMap;
       }
       public void emptyMap(){
           paramsMap.clear();
       }
  

       /**
        * 分析处理带命名参数的SQL语句。使用Map存储参数，然后将参数替换成?
        * <br/>
        * 作者：wallimn　时间：2009-1-8　下午12:14:10<br/>
        * 邮件：wallimn@sohu.com<br/>
        * 博客：http://blog.csdn.net/wallimn<br/>
        * 参数：<br/>
        * @param sql
        * @return
        */
       public String parseSql(String sql) {
           String regex = "(:(\\w+))";
           Pattern p = Pattern.compile(regex);
           Matcher m = p.matcher(sql);
           emptyMap();
           int idx=1;
           while (m.find()) {
               //参数名称可能有重复，使用序号来做Key
               paramsMap.put(new Integer(idx++), m.group(2));
               //System.out.println(m.group(2));
           }
           String result = sql.replaceAll(regex, "?");
           log.debug("分析前："+sql);
           log.debug("分析后："+result);
           return result;
       }
       /**
        * 使用参数值Map，填充pStat
        * <br/>
        * 作者：wallimn　时间：2009-1-8　下午12:15:36<br/>
        * 邮件：wallimn@sohu.com<br/>
        * 博客：http://blog.csdn.net/wallimn<br/>
        * 参数：<br/>
        * @param pStat
        * @param pMap 命名参数的值表，其中的值可以比较所需的参数多。
        * @return
        */
       public boolean fillParameters(PreparedStatement pStat,Map<String,Object> pMap){
           boolean result=true;
           String paramName=null;
           Object paramValue=null;
           int idx=1;
           for(java.util.Iterator<Entry<Integer, String>> itr = paramsMap.entrySet().iterator(); itr.hasNext();){
               Entry<Integer, String> entry = (Entry<Integer, String>)itr.next();
               paramName = entry.getValue();
               idx=entry.getKey().intValue();
               //不包含会返回null
               paramValue = pMap.get(paramName);          
               try {
                   //paramValue为null，会出错吗？需要测试
                   pStat.setObject(idx, paramValue);
               } catch (Exception e) {
                   log.error("填充参数出错，原因："+e.getMessage());
                   result=false;
               }
           }
           return result;
       }
   }
  
