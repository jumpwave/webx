package org.flhy.dataAudit.util;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.flhy.dataAudit.domain.DataAuditScriptParam;
import org.flhy.dataAudit.domain.DataAuditTask;

public class SQLScriptValidate {
	/*判断语句是否为select*/
	public boolean isSelect(String script){
		if(StringUtils.startsWithIgnoreCase(script, "select")){
			return true;
		}else{
			return false;
		}
	}
	
	public boolean notEnd(String script){
		if(!StringUtils.endsWithIgnoreCase(script, ";")){
			return true;
		}else{
			return false;
		}		
	}
	
//	public boolean over100(DataAuditTask taskCfg)throws Exception{
//		SbiDataSourceMapper sbiDataSourceMapper = AppContext.getBean("sbiDataSourceMapper");
//		SbiDataSource ds = null;		
//		ds = sbiDataSourceMapper.getByName(taskCfg.getData_source());
//
//		if(null != ds && StringUtils.isNotEmpty(taskCfg.getAudit_script())){
//			String driver = ds.getDriver();
//			String url =  ds.getUrlConnection();
//			JdbcUtil jdbcUtil = new JdbcUtil(driver,url,ds.getUsername(),ds.getPassword());
//			jdbcUtil.getConnection();
//			
//			DataAuditResult dataAuditResult = new DataAuditResult();
//			dataAuditResult.setBegin_time(DateUtil.dateToString(new Date()));
//			List<DataAuditScriptParam> paramsList =  taskCfg.getScript_params();
//			Map<String,Object> params = new HashMap<String,Object>();
//			if(CollectionUtils.isNotEmpty(paramsList)){
//				for(DataAuditScriptParam p: paramsList){
//					if(!"system".equalsIgnoreCase(p.getParam_type())){
//						params.put(p.getParam_name(), p.getParam_value());
//					}else{
//						if("last_month".equalsIgnoreCase(p.getParam_value())){
//							params.put(p.getParam_name(), DateUtil.dateToString(DateUtils.addMonths(new Date(), -1), "yyyy-MM"));
//						}else if("current_month".equalsIgnoreCase(p.getParam_value())){
//							params.put(p.getParam_name(), DateUtil.dateToString(new Date(), "yyyy-MM"));
//						}							
//					}						
//				}
//			}
//			String aduditScript = taskCfg.getAudit_script();
//			if("POSTGRES".equalsIgnoreCase(ds.getType())){
//				aduditScript ="select * from (" +  aduditScript + ") aduitsql LIMIT 100";
//			}else if("ORACLE".equalsIgnoreCase(ds.getType())){
//				aduditScript ="select aduitsql.*, rownum from (" +  aduditScript + ") aduitsql where rownum <= 100";
//			}
//			
//			List<Map<String, Object>> rsList = jdbcUtil.findResultNamedParam(aduditScript, params);
//			if(null != rsList && rsList.size() > 100){
//				return true;
//			}
////			if(null != rsList && rsList.size() == 0){
////				return true;
////			}
//			
//		}
//		
//		return false;
//	}
		
	/**
	 * 验证配置的脚本中参数符与配置的参数个数和名称是否一致
	 * @param taskCfg
	 * @return
	 */
	public boolean sameScriptParams(DataAuditTask taskCfg){
		String script = taskCfg.getAudit_script();
		List<DataAuditScriptParam> script_params = taskCfg.getScript_params();
		if(null != script_params){
//			if(stringNumbers(script) != taskCfg.getScript_params().size()){
//				return false;
//			}			
			
			for(DataAuditScriptParam sp: script_params){
				
				if(!script.contains(":" + sp.getParam_name())){
					return false;
				}
				
			}

		}else{
			if(script.indexOf(":")>-1){
				return false;
			}
		}
		
		return true;

	}
	
	private int counter = 0;
	public int stringNumbers(String str)  
	{  
	  if (str.indexOf(":")==-1)  
      {  
          return 0;  
      }  
      else if(str.indexOf(":") != -1)  
      {  
           counter++;  
           stringNumbers(str.substring(str.indexOf(":")+1));  
           return counter;  
      }  
      return 0;  
   }  

	
	public static void main(String[] args){
		String sql = "select t2.acct_date as \"帐期\",t2.fee_total as \"汇总值\",t1.fee_total as \"明细值\" from (select substr(t.fee_time,1,7) acct_date ,sum(t.fee) fee_total from JH_FEE_DETAIL t where substr(t.fee_time,1,7) between #p1# and #p2# group by substr(t.fee_time,1,7)) t1,"
+"(select t.acct_date ,t.fee_total from JH_FEE_SUM t where t.acct_date between #p1# and #p2#)t2 "
+"where t1.acct_date = t2.acct_date and t1.fee_total <> t2.fee_total";
		SQLScriptValidate ssv = new SQLScriptValidate();
		//System.out.println(ssv.stringNumbers(sql));
		//System.out.println(StringUtils.substringsBetween(sql, ":"," "));
		String[] ss = StringUtils.substringsBetween(sql, "#","#");
		for(int i=0;i<ss.length;i++){
			System.out.println(ss[i]);
		}
	}
	
	

}
