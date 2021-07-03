package com.ticker.message.listener;

import io.netty.channel.nio.NioEventLoopGroup;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.embedded.netty.NettyReactiveWebServerFactory;
import org.springframework.boot.web.embedded.netty.NettyServerCustomizer;
import org.springframework.context.annotation.Bean;
import reactor.netty.http.server.HttpServer;

import java.util.Collections;

@SpringBootApplication
public class SpringBootModulesApplication {
    public static void main(String[] args) {
        SpringApplication.run(SpringBootModulesApplication.class, args);
    }

    // @Bean
    // public NioEventLoopGroup nioEventLoopGroup() {
    //     return new NioEventLoopGroup(10);
    // }

    // @Bean
    // public NettyReactiveWebServerFactory factory(NioEventLoopGroup eventLoopGroup) {
    //     NettyReactiveWebServerFactory factory = new NettyReactiveWebServerFactory();
    //     factory.setServerCustomizers(Collections.singletonList(new NettyServerCustomizer(){

    //         @Override
    //         public HttpServer apply(HttpServer httpServer) {
    //             return httpServer.runOn(eventLoopGroup);
    //         }
    //     }));
    //     return factory;
    // }
}
