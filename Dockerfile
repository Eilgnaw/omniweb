# 使用带有 Nginx 的官方基础镜像
FROM nginx:latest

# 将构建好的 Vue.js 文件复制到 Nginx 服务器的相应目录
COPY /build /usr/share/nginx/html

COPY /nginx.conf /etc/nginx/nginx.conf
# 暴露 80 端口
EXPOSE 80

# 使用 Nginx 默认的启动命令
CMD ["nginx", "-g", "daemon off;"]