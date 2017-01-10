package org.flhy.dataAudit.service;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.flhy.dataAudit.dao.DataAuditResultMapper;
import org.flhy.dataAudit.domain.DataAuditResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.pagehelper.PageInfo;

@Controller
public class DataAuditResultController {
	private static final Log LOG = LogFactory.getLog(DataAuditTaskController.class);
	@Autowired
	private DataAuditResultMapper dataAuditResultMapper;
	@ResponseBody
	@RequestMapping(value="/DataAuditResult",method=RequestMethod.GET)		
	public List<DataAuditResult> findDataAuditResult(@RequestParam(value="task_id")  String task_id,@RequestParam(value="has_exception", required=false)  String has_exception
			,@RequestParam(value="timeMin", required=false)  String timeMin ,@RequestParam(value="timeMax", required=false)  String timeMax){
		DataAuditResult dataAuditResult = new DataAuditResult();
		dataAuditResult.setTask_id(task_id);
		if(StringUtils.isNotEmpty(has_exception)){
			dataAuditResult.setHas_exception(has_exception);
		}
		
		return dataAuditResultMapper.findDataAuditResult(dataAuditResult);
	}
	@ResponseBody
	@RequestMapping(value="/DataAuditResult/page",method=RequestMethod.GET)			
	public PageInfo<DataAuditResult> pageDataAuditResult(@RequestParam(value="pageNum", required=false)  int pageNum ,@RequestParam(value="pageSize", required=false) int pageSize, 
			@RequestParam(value="task_id")  String task_id,@RequestParam(value="has_exception", required=false)  String has_exception
			,@RequestParam(value="timeMin", required=false)  String timeMin ,@RequestParam(value="timeMax", required=false)  String timeMax){

		DataAuditResult dataAuditResult = new DataAuditResult();
		dataAuditResult.setTask_id(task_id);
		if(StringUtils.isNotEmpty(has_exception)){
			dataAuditResult.setHas_exception(has_exception);
		}
		
	    List<DataAuditResult> list = dataAuditResultMapper.pageDataAuditResult(dataAuditResult,timeMin, timeMax,pageNum, pageSize);
	    PageInfo<DataAuditResult> page = new PageInfo(list);
		//System.out.print(((Page) list).getTotal());
		return page;
	}	
	
}
