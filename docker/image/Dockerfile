FROM ubuntu:24.04

RUN sed -i.bak -e "s%http://archive.ubuntu.com/ubuntu/%http://jp.archive.ubuntu.com/ubuntu/%g" /etc/apt/sources.list
RUN sed -i.bak -e "s%http://security.ubuntu.com/ubuntu/%http://jp.archive.ubuntu.com/ubuntu/%g" /etc/apt/sources.list
ENV TZ=Asia/Tokyo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt update && apt upgrade -y && apt install -y

# install nodejs
RUN apt install nodejs npm curl -y
RUN npm install -g n && n 18.17.0
RUN apt purge nodejs npm -y
RUN node -v

# install git
RUN apt-get install -y software-properties-common \
    && add-apt-repository ppa:git-core/ppa \
    && apt-get update -y
RUN apt-get install -y git

COPY ./start.sh /start.sh
CMD bash /start.sh