package org.flhy.log;

import  java.lang.annotation.*; 
/**
 * 
 */
@Target({ElementType.PARAMETER, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface ClassTitle { 
     String description()  default "" ; 
}

