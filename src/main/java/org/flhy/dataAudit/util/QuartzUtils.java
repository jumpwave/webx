package org.flhy.dataAudit.util;

import static org.quartz.CronScheduleBuilder.cronSchedule;
import static org.quartz.JobBuilder.newJob;
import static org.quartz.TriggerBuilder.newTrigger;

import org.flhy.dataAudit.domain.DataAuditTask;
import org.quartz.Job;
import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SimpleScheduleBuilder;
import org.quartz.Trigger;
import org.quartz.TriggerKey;
import org.quartz.impl.StdSchedulerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;

/**
 * 类名：QuartzManager <br/>
 * 功能：<br/>
 * 详细：Quartz增、删、改工具类 <br/>
 * 作者： Tliu <br/>
 * 日期：2015-7-17 <br/>
 */
public class QuartzUtils {
 
    private Logger log = null;
 
    private Scheduler scheduler = null;
     
    public static final String DATA_KEY = "STATE_DATA";
     
    public QuartzUtils (){
        try {
        	log = LoggerFactory.getLogger(QuartzUtils.class);
            scheduler = new StdSchedulerFactory().getScheduler();
            log.info("初始化调度器 ");
        } catch (SchedulerException ex) {
            log.error("初始化调度器=> [失败]:" + ex.getLocalizedMessage());
        }
    }   
    public void addJob(DataAuditTask task,  Class<? extends Job> clazz) { 
        try {       
            //构造任务
            JobDetail job = newJob(clazz)
                    .withIdentity(task.getTask_id(), "DATA_AUDIT")                
                    .build();
              
            Trigger trg = null;
            SimpleScheduleBuilder ss = SimpleScheduleBuilder.simpleSchedule();
            if("more".equalsIgnoreCase(task.getExecute_times())){
                if("minute".equalsIgnoreCase(task.getExecute_interval_unit())){
                	ss.withIntervalInMinutes(Integer.valueOf(task.getExecute_interval()));
                }else if("hour".equalsIgnoreCase(task.getExecute_interval_unit())){
                	ss.withIntervalInHours(Integer.valueOf(task.getExecute_interval()));
                }else if("day".equalsIgnoreCase(task.getExecute_interval_unit())){
                	ss.withIntervalInHours(Integer.valueOf(task.getExecute_interval()) * 24);
                }else if("month".equalsIgnoreCase(task.getExecute_interval_unit())){
                	ss.withIntervalInHours(Integer.valueOf(task.getExecute_interval()) * 24 * 30);
                }        
                //构造任务触发器
                trg = newTrigger()
                        .withIdentity(task.getTask_id(), "DATA_AUDIT")
                        .withSchedule(ss.repeatForever())
                        .startAt(DateUtil.stringToDate(task.getFirst_execute_time()))
                        .build();  
            }else{
                //构造任务触发器
                trg = newTrigger()
                        .withIdentity(task.getTask_id(), "DATA_AUDIT")
                        .startAt(DateUtil.stringToDate(task.getFirst_execute_time()))
                        .build();     
            }
            trg.getJobDataMap().put("dataAuditTask", task); 
            //将作业添加到调度器
            scheduler.scheduleJob(job, trg);
            log.info("创建作业=> [作业名称：" + task.getTask_id() + " 作业组：DATA_AUDIT] ");
        } catch (SchedulerException e) {
            e.printStackTrace();
            log.error("创建作业=> [作业名称：" + task.getTask_id()  + " 作业组：DATA_AUDIT]=> [失败]");
        }    	    	

    }    
    
    public void addJob(String name, String group, Class<? extends Job> clazz,String cronExpression) {                 
        try {       
            //构造任务
            JobDetail job = newJob(clazz)
                    .withIdentity(name, group)                
                    .build();
             
            //构造任务触发器
            Trigger trg = newTrigger()
                    .withIdentity(name, group)
                    .withSchedule(cronSchedule(cronExpression))
                    .build();       
             
            //将作业添加到调度器
            scheduler.scheduleJob(job, trg);
            log.info("创建作业=> [作业名称：" + name + " 作业组：" + group + "] ");
        } catch (SchedulerException e) {
            e.printStackTrace();
            log.error("创建作业=> [作业名称：" + name + " 作业组：" + group + "]=> [失败]");
        }
    }
     
    public void addJob(DataAuditTask task,  Class<? extends Job> clazz,String cronExpression){
        try {       
            //构造任务
            JobDetail job = newJob(clazz)
                    .withIdentity(task.getTask_id(), "DATA_AUDIT")                
                    .build();
            job.getJobDataMap().put("dataAuditTask", task);   
            
            //构造任务触发器
            Trigger trg = newTrigger()
                    .withIdentity(task.getTask_id(), "DATA_AUDIT")
                    .withSchedule(cronSchedule(cronExpression))
                    .build();       
            
            //将作业添加到调度器
            scheduler.scheduleJob(job, trg);
            log.info("创建作业=> [作业名称：" + task.getTask_id() + " 作业组：DATA_AUDIT] ");
        } catch (SchedulerException e) {
            e.printStackTrace();
            log.error("创建作业=> [作业名称：" + task.getTask_id()  + " 作业组：DATA_AUDIT]=> [失败]");
        }    	
    }
    
    public void removeJob(String name, String group){
        try {
            TriggerKey tk = TriggerKey.triggerKey(name, group);
            scheduler.pauseTrigger(tk);//停止触发器  
            scheduler.unscheduleJob(tk);//移除触发器
            JobKey jobKey = JobKey.jobKey(name, group);
            scheduler.deleteJob(jobKey);//删除作业
            log.info("删除作业=> [作业名称：" + name + " 作业组：" + group + "] ");
        } catch (SchedulerException e) {
            e.printStackTrace();
            log.error("删除作业=> [作业名称：" + name + " 作业组：" + group + "]=> [失败]");
        }
    }
     
    public void pauseJob(String name, String group){
        try {
            JobKey jobKey = JobKey.jobKey(name, group);
            scheduler.pauseJob(jobKey);
            log.info("暂停作业=> [作业名称：" + name + " 作业组：" + group + "] ");
        } catch (SchedulerException e) {
            e.printStackTrace();
            log.error("暂停作业=> [作业名称：" + name + " 作业组：" + group + "]=> [失败]");
        }
    }
     
    public void resumeJob(String name, String group){
        try {
            JobKey jobKey = JobKey.jobKey(name, group);         
            scheduler.resumeJob(jobKey);
            log.info("恢复作业=> [作业名称：" + name + " 作业组：" + group + "] ");
        } catch (SchedulerException e) {
            e.printStackTrace();
            log.error("恢复作业=> [作业名称：" + name + " 作业组：" + group + "]=> [失败]");
        }       
    }
     
    public void modifyTime(String name, String group, String cronExpression){       
        try {
            TriggerKey tk = TriggerKey.triggerKey(name, group);
            //构造任务触发器
            Trigger trg = newTrigger()
                    .withIdentity(name, group)
                    .withSchedule(cronSchedule(cronExpression))
                    .build();       
            scheduler.rescheduleJob(tk, trg);
            log.info("修改作业触发时间=> [作业名称：" + name + " 作业组：" + group + "] ");
        } catch (SchedulerException e) {
            e.printStackTrace();
            log.error("修改作业触发时间=> [作业名称：" + name + " 作业组：" + group + "]=> [失败]");
        }
    }
 
    public void start() {
        try {
            scheduler.start();
            log.info("启动调度器 ");
        } catch (SchedulerException e) {
            e.printStackTrace();
            log.error("启动调度器=> [失败]");
        }
    }
 
    public void shutdown() {
        try {
            scheduler.shutdown();
            log.info("停止调度器 ");
        } catch (SchedulerException e) {
            e.printStackTrace();
            log.error("停止调度器=> [失败]");
        }
    }

}