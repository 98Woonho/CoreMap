package com.coremap.demo.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/user/**").addResourceLocations("classpath:/static/user/"); //.setCachePeriod(60*60*24*365);
        registry.addResourceHandler("/resources/**").addResourceLocations("classpath:/static/resources/"); //.setCachePeriod(60*60*24*365);
        registry.addResourceHandler("/home/**").addResourceLocations("classpath:/static/home/"); //.setCachePeriod(60*60*24*365);
        // http://localhost:8080/imageboard/[이미지경로] 입력하면 이미지가 나옴. 이게 없으면 이미지 접근 불가능
        registry.addResourceHandler("/productimage/**").addResourceLocations("file:/productimage/");//.setCachePeriod(60*60*24*365);
    }

}
