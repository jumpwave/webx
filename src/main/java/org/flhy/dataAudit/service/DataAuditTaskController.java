package org.flhy.dataAudit.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.flhy.dataAudit.bo.ResultResponse;
import org.flhy.dataAudit.dao.DataAuditScriptParamMapper;
import org.flhy.dataAudit.dao.DataAuditTaskMapper;
import org.flhy.dataAudit.domain.DataAuditScriptParam;
import org.flhy.dataAudit.domain.DataAuditTask;
import org.flhy.dataAudit.exception.DataAuditTaskNotFoundException;
import org.flhy.dataAudit.util.HttpUtil;
import org.flhy.dataAudit.util.PropertiesUtil;
import org.flhy.dataAudit.util.QuartzUtils;
import org.flhy.dataAudit.util.SQLScriptValidate;
import org.flhy.exception.CallException;
import org.flhy.log.MethodTitle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@Controller
@RequestMapping({"/","/AllDataAuditTask"})	
public class DataAuditTaskController {
	private static final Log LOG = LogFactory.getLog(DataAuditTaskController.class);
	@Autowired
	private DataAuditTaskMapper dataAuditTaskMapper;
	@Autowired
	private DataAuditScriptParamMapper dataAuditScriptParamMapper;
	
	private void validateAduditScript(DataAuditTask task){
		SQLScriptValidate validate = new SQLScriptValidate();
		ResultResponse rr = ResultResponse.getSuccess();
		if(!validate.isSelect(task.getAudit_script())){
			throw new ValidateAduditScriptException("稽核脚本不是Select语句！");
//			rr.setRet(ResultResponse.RET_FAIL);
//			rr.setMsg("稽核脚本不是Select语句！");
//			return rr;
		}
		if(!validate.notEnd(task.getAudit_script())){
			throw new ValidateAduditScriptException("稽核脚本不应带标点符号结束！");
//			rr.setRet(ResultResponse.RET_FAIL);
//			rr.setMsg("稽核脚本不应带标点符号结束！");	
//			return rr;
		}
		if(!validate.sameScriptParams(task)){
			throw new ValidateAduditScriptException("稽核脚本与参数的个数或名称不相符！");
//			rr.setRet(ResultResponse.RET_FAIL);
//			rr.setMsg("稽核脚本与参数的个数或名称不相符！");	
//			return rr;			
		}
//		if(validate.over100(task)){
//			rr.setRet(ResultResponse.RET_FAIL);
//			rr.setMsg("稽核脚本返回结果超过100条,建议优化！");	
//			return rr;
//		}			
//		rr.setRet(ResultResponse.RET_SUCCESS);
//		return rr;
	}
	
	@ResponseBody
	@RequestMapping(value="/DataAuditTask",method=RequestMethod.POST)		
	public ResultResponse insertDataAuditTask(@RequestBody DataAuditTask task){
		ResultResponse rr = ResultResponse.getSuccess();
		try{
			this.validateAduditScript(task);
			if(ResultResponse.RET_FAIL == rr.getRet()){
				return rr;
			}
		
			String id = UUID.randomUUID().toString().replaceAll("-", "");
			task.setTask_id(id);
			dataAuditTaskMapper.insertDataAuditTask(task);
			List<DataAuditScriptParam> paramList = task.getScript_params();
			if(CollectionUtils.isNotEmpty(paramList)){
				for(DataAuditScriptParam param : paramList){
					String paramId = UUID.randomUUID().toString().replaceAll("-", "");
					param.setParam_id(paramId);
					param.setTask_id(id);
					dataAuditScriptParamMapper.insertDataAuditScriptParam(param);
				}	
			}
			QuartzUtils quartzUtils = new QuartzUtils();
			quartzUtils.addJob(task, DataAuditJob.class);
		}catch(Exception e){
			LOG.error("新增数据稽核任务异常", e);
			rr.setRet(ResultResponse.RET_FAIL);
			rr.setMsg(ResultResponse.MSG_FAIL);
			
		}
		return rr;
	}
	
	@MethodTitle("修改数据稽查任务")
	@ResponseBody
	@RequestMapping(value="/DataAuditTask",method=RequestMethod.PUT)		
	public ResultResponse updateDataAuditTask(@Valid @RequestBody DataAuditTask task){
//		if(bindingResult.hasErrors()){
//			System.out.println("参数验证失败");
//		}
		ResultResponse rr = ResultResponse.getSuccess();
		this.validateAduditScript(task);
		try{
			if(true){
				throw new CallException();
			}					
			DataAuditTask taskOld = this.getDataAuditTask(task.getTask_id());
			BeanUtils.copyProperties(taskOld, task);
			dataAuditTaskMapper.updateDataAuditTask(taskOld);
			List<String> taskIds = new ArrayList<String>();
			taskIds.add(task.getTask_id());
			dataAuditScriptParamMapper.delete(taskIds);
			List<DataAuditScriptParam> paramList = task.getScript_params();
			if(CollectionUtils.isNotEmpty(paramList)){
				for(DataAuditScriptParam param : paramList){
					String paramId = UUID.randomUUID().toString().replaceAll("-", "");
					param.setParam_id(paramId);
					param.setTask_id(task.getTask_id());
					dataAuditScriptParamMapper.insertDataAuditScriptParam(param);
				}	
			}			
			QuartzUtils quartzUtils = new QuartzUtils();
			quartzUtils.removeJob(task.getTask_id(), "DATA_AUDIT");
			quartzUtils.addJob(task, DataAuditJob.class);
		}catch(Exception e){
//			LOG.error("修改数据稽核任务异常", e);
//			rr.setRet(ResultResponse.RET_FAIL);
//			rr.setMsg(ResultResponse.MSG_FAIL);
			throw new CallException();
		}
		return rr;		
	}
	
	@MethodTitle("查询所有的数据稽查任务")
	@ResponseBody
	//@RequestMapping(value="/AllDataAuditTask",method=RequestMethod.GET)
	@RequestMapping(method=RequestMethod.GET)
	public List<DataAuditTask> findAllDataAuditTask(){
		return dataAuditTaskMapper.findDataAuditTask();
	}
	
	@ResponseBody
	@RequestMapping(value="/DataAuditTask/{task_id}",method=RequestMethod.GET)		
	public DataAuditTask getDataAuditTask(@PathVariable String task_id){
		DataAuditTask task = dataAuditTaskMapper.getDataAuditTask(task_id);
		if(null == task) throw new DataAuditTaskNotFoundException();
		return task;
	}	
	
	@ResponseBody
	@RequestMapping(value="/DataAuditTask/{task_id}",method=RequestMethod.DELETE)		
	public ResultResponse deleteDataAuditTask(@PathVariable String task_id){
		ResultResponse rr = ResultResponse.getSuccess();
		try{
			List<String> taskIds = new ArrayList<String>();
			taskIds.add(task_id);
			dataAuditTaskMapper.delete(taskIds);
			QuartzUtils quartzUtils = new QuartzUtils();
			quartzUtils.removeJob(task_id, "DATA_AUDIT");			
		}catch(Exception e){
			LOG.error("删除数据稽核任务异常", e);
			rr.setRet(ResultResponse.RET_FAIL);
			rr.setMsg(ResultResponse.MSG_FAIL);
			
		}
		return rr;		
	}		
	
	@ResponseBody
	@RequestMapping(value="/FolderTree",method=RequestMethod.GET)			
	public String findFolderTree(){
		HttpUtil httpUitl = HttpUtil.getTool();
		try{			
			Properties pps = PropertiesUtil.getPropertiesByClassPath("config.properties");
			String spagoBIWeb = pps.getProperty("spagobi.web");
			String url = "http://" + spagoBIWeb + "/servlet/AdapterHTTP?ACTION_NAME=LOAD_DOCUMENT_ACTION&ACTION_MODEL=list";
			String folderJson = httpUitl.doPost(url,"","application/json");
			//String folderJson = "[{\"id\":1,\"pId\":0,\"name\":\"报表目录\",\"fId\":1,\"dId\":0,\"open\":true,\"iconSkin\":\"role\"},{\"id\":2,\"pId\":1,\"name\":\"消费报表\",\"fId\":2,\"dId\":0,\"open\":false,\"iconSkin\":\"bluefolder\"},{\"id\":3,\"pId\":1,\"name\":\"收入报表\",\"fId\":3,\"dId\":0,\"open\":false,\"iconSkin\":\"bluefolder\"},{\"id\":4,\"pId\":1,\"name\":\"补贴报表\",\"fId\":4,\"dId\":0,\"open\":false,\"iconSkin\":\"bluefolder\"},{\"id\":5,\"pId\":1,\"name\":\"充值报表\",\"fId\":5,\"dId\":0,\"open\":false,\"iconSkin\":\"bluefolder\"},{\"id\":6,\"pId\":1,\"name\":\"日志查询\",\"fId\":6,\"dId\":0,\"open\":false,\"iconSkin\":\"bluefolder\"},{\"id\":7,\"pId\":1,\"name\":\"1\",\"fId\":8,\"dId\":0,\"open\":false,\"iconSkin\":\"bluefolder\"},{\"id\":8,\"pId\":1,\"name\":\"2\",\"fId\":9,\"dId\":0,\"open\":false,\"iconSkin\":\"bluefolder\"},{\"id\":9,\"pId\":1,\"name\":\"3\",\"fId\":10,\"dId\":0,\"open\":false,\"iconSkin\":\"bluefolder\"},{\"id\":10,\"pId\":1,\"name\":\"4\",\"fId\":11,\"dId\":0,\"open\":false,\"iconSkin\":\"bluefolder\"},{\"id\":11,\"pId\":1,\"name\":\"5\",\"fId\":12,\"dId\":0,\"open\":false,\"iconSkin\":\"bluefolder\"},{\"id\":12,\"pId\":1,\"name\":\"6\",\"fId\":13,\"dId\":0,\"open\":false,\"iconSkin\":\"bluefolder\"},{\"id\":13,\"pId\":1,\"name\":\"8\",\"fId\":14,\"dId\":0,\"open\":false,\"iconSkin\":\"bluefolder\"},{\"id\":14,\"pId\":1,\"name\":\"9\",\"fId\":15,\"dId\":0,\"open\":false,\"iconSkin\":\"bluefolder\"},{\"id\":15,\"pId\":1,\"name\":\"急急急急急急急急急将建军节建军节建军节\",\"fId\":16,\"dId\":0,\"open\":false,\"iconSkin\":\"bluefolder\"},{\"id\":16,\"pId\":1,\"name\":\"飞凤飞飞凤飞飞凤飞飞飞凤飞飞凤飞飞凤飞飞\",\"fId\":17,\"dId\":0,\"open\":false,\"iconSkin\":\"bluefolder\"},{\"id\":17,\"pId\":1,\"name\":\"的顶顶顶顶顶的顶顶顶顶顶顶顶顶顶顶\",\"fId\":18,\"dId\":0,\"open\":false,\"iconSkin\":\"bluefolder\"},{\"id\":18,\"pId\":1,\"name\":\"biadmin\",\"fId\":7,\"dId\":0,\"open\":false,\"iconSkin\":\"bluefolder\"}]";
			return folderJson;
		}catch(Exception e){
			e.printStackTrace();
			LOG.error("查询成果物树结构异常", e);
		}
		return null;
	}
	
	@ResponseBody
	@RequestMapping(value="/DataAuditTask/{task_id}/publish",method=RequestMethod.POST)	
	public ResultResponse publish(@PathVariable String task_id, @RequestParam String task_name, @RequestParam String folder_id,HttpServletRequest request){
		ResultResponse rr = ResultResponse.getSuccess();
		try{
			Properties pps = PropertiesUtil.getPropertiesByClassPath("config.properties");
			String spagoBIWeb = pps.getProperty("spagobi.web");			
			String url = "http://" + spagoBIWeb + "/servlet/AdapterHTTP?ACTION_NAME=WORKSHEET_DOCUMENT_ACTION&ACTION_MODEL=save";
			HttpUtil httpUitl = HttpUtil.getTool();
			HashMap<String,String> params = new HashMap<String,String>();
			params.put("label", "ws_" + new Date().getTime());
			params.put("typeid", "WORKSHEET");
			String path = request.getContextPath();
			String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
			String redirectUrl =/* basePath +*/path +  "/web/dataAudit/detail.jsp?taskId=" + task_id + "&hideIcon=1";
			params.put("wk_definition", "{'basicInfo':{'reportFolderId':'"+ folder_id +"','reportName':'"+task_name+"'}}");
			params.put("keywords", "dataAudit");
			params.put("language", redirectUrl);
			String result = httpUitl.doPost(url, params, "UTF-8");
			
			rr.setResult(result);
		}catch(Exception e){
			LOG.error("稽核任务发布异常", e);
			rr.setRet(ResultResponse.RET_FAIL);
			rr.setMsg(ResultResponse.MSG_FAIL);
			
		}
		return rr;
		
	}
	
	@ExceptionHandler(ValidateAduditScriptException.class)
	public @ResponseBody ResultResponse handlerValidateAduditScript(ValidateAduditScriptException ve){
		// 获得当前类名 
		//String clazz = Thread.currentThread() .getStackTrace()[1].getClassName(); 
		// 获得当前方法名 
		//String method = Thread.currentThread() .getStackTrace()[1].getMethodName();	
		
		ResultResponse rr = ResultResponse.getSuccess();
		rr.setRet(ResultResponse.RET_FAIL);
		rr.setMsg(ve.getMsg());
		String reason = ve.getClass().getAnnotation(ResponseStatus.class).reason();
		LOG.error(reason + ":" + ve.getMsg());
		return rr;
	}
	
	@ResponseStatus(value=HttpStatus.BAD_REQUEST,reason="数据稽核脚本验证失败")
	public class ValidateAduditScriptException  extends RuntimeException{
		private String msg;
		public ValidateAduditScriptException(String msg){
			this.msg = msg;
		}
		public String getMsg() {
			return msg;
		}
		
	}
	
	
	
}
