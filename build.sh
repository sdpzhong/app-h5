#!/bin/bash
# 指定构建版本号
#VERSION=1.3.1
VERSION=1.0.0
NAME=appweb
RUNC=podman
RMI=false
REGISTRY=ccr.ccs.tencentyun.com/yudo

while getopts v:n:p:r:d OPTION
do
    case $OPTION in
        v)
            VERSION=$OPTARG
            ;;
        n)
            if [[ -n "$OPTARG" ]]; then
              NAME=$OPTARG
            fi
            ;;
        p)
            if [[ "$OPTARG" ]]; then
               RUNC=$OPTARG
            fi
            ;;
        r)
            if [[ "$OPTARG" ]]; then
               REGISTRY=$OPTARG
            fi
            ;;
        d)
            RMI=true
            ;;
        ?)                       #如果出现错误，则解析为?
            echo "Invalid option: -$OPTARG"
            echo -e "\t-v <string>\t 指定打包镜像的版本号，eg：1.0.0"
            echo -e "\t-n <string> \t 指定打包的项目名称，eg：test"
            echo -e "\t-p <string> \t 指定容器运行时，支持：docker/podman，默认：podman"
            echo -e "\t-d \t\t 标记是否删除上传后的本地镜像"
            echo -e "\t-r <string> \t 指定推送的镜像地址前缀，默认：ccr.ccs.tencentyun.com/2024"
            exit 1
            ;;
    esac
done

echo "build config runc: $RUNC name: $NAME version: $VERSION rmi: $RMI"

$RUNC build --platform=linux/amd64 -t $REGISTRY/${NAME}:${VERSION} .
#podman tag ccr.ccs.tencentyun.com/2024/${NAME}:${VERSION} ccr.ccs.tencentyun.com/2024/${NAME}:latest
$RUNC push $REGISTRY/${NAME}:${VERSION}
#podman push ccr.ccs.tencentyun.com/2024/${NAME}:latest

# 删除本地镜像，默认不删除
if [[ "$RMI" == "true" ]]; then
  echo "delete local images [$REGISTRY/${NAME}:${VERSION}]"
  $RUNC rmi $REGISTRY/${NAME}:${VERSION}
  echo "delete local images completed."
fi
