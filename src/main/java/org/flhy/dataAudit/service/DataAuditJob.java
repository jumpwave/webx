package org.flhy.dataAudit.service;

import org.flhy.dataAudit.util.QuartzUtils;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DataAuditJob implements Job{
	private Logger log  = LoggerFactory.getLogger(QuartzUtils.class); 
	@Override
	public void execute(JobExecutionContext context) throws JobExecutionException {
//		JobDataMap data = context.getTrigger().getJobDataMap();  
//		DataAuditTask taskCfg = (DataAuditTask)data.get("dataAuditTask");
//		SbiDataSourceMapper sbiDataSourceMapper = AppContext.getBean("sbiDataSourceMapper");
//		DataAuditResultMapper dataAuditResultMapper = AppContext.getBean("dataAuditResultMapper");
//		
//		SbiDataSource ds = null;
//		try {
//		    ds = sbiDataSourceMapper.getByName(taskCfg.getData_source());
//		} catch (Exception e) {
//			e.printStackTrace();
//			return;
//		}
//		if(null != ds && StringUtils.isNotEmpty(taskCfg.getAudit_script())){
//			String driver = ds.getDriver();
//			String url =  ds.getUrlConnection();
//			JdbcUtil jdbcUtil = new JdbcUtil(driver,url,ds.getUsername(),ds.getPassword());
//			jdbcUtil.getConnection();
//			try {
//				DataAuditResult dataAuditResult = new DataAuditResult();
//				dataAuditResult.setBegin_time(DateUtil.dateToString(new Date()));
//				List<DataAuditScriptParam> paramsList =  taskCfg.getScript_params();
//				Map<String,Object> params = new HashMap<String,Object>();
//				if(CollectionUtils.isNotEmpty(paramsList)){
//					for(DataAuditScriptParam p: paramsList){
//						if(!"system".equalsIgnoreCase(p.getParam_type())){
//							params.put(p.getParam_name(), p.getParam_value());
//						}else{
//							if("last_month".equalsIgnoreCase(p.getParam_value())){
//								params.put(p.getParam_name(), DateUtil.dateToString(DateUtils.addMonths(new Date(), -1), "yyyy-MM"));
//							}else if("current_month".equalsIgnoreCase(p.getParam_value())){
//								params.put(p.getParam_name(), DateUtil.dateToString(new Date(), "yyyy-MM"));
//							}							
//						}						
//					}
//				}
//				List<Map<String, Object>> rsList = jdbcUtil.findResultNamedParam(taskCfg.getAudit_script(), params);
//				if(CollectionUtils.isNotEmpty(rsList)){
//					dataAuditResult.setHas_exception("1"); //有异常
//					Map<String, Object> line0 = rsList.get(0);
//					Set<String> keySet = line0.keySet();
//					Gson gson = new Gson();
//					dataAuditResult.setException_headers(gson.toJson(keySet));
//					dataAuditResult.setExceptions(gson.toJson(rsList));
//				}else{
//					dataAuditResult.setHas_exception("0");
//				}
//				
//				String resultId = UUID.randomUUID().toString().replaceAll("-", "");
//				dataAuditResult.setResult_id(resultId);
//				dataAuditResult.setAudit_script(taskCfg.getAudit_script());			
//				dataAuditResult.setTask_id(taskCfg.getTask_id());
//				dataAuditResult.setEnd_time(DateUtil.dateToString(new Date()));
//				
//				dataAuditResultMapper.insertDataAuditResult(dataAuditResult);
//				
//			} catch (Exception e) {
//				log.error("任务执行异常:" + taskCfg.getTask_name()  ,e);
//				e.printStackTrace();
//			} finally {
//				jdbcUtil.releaseConn();
//			}
//		}
	}

}
