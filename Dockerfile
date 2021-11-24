FROM tpaas-registry-itg.jdcloud.com/tpaas-test/node:12
ENV ALARM_CHANNAL_CONFIG=1,2

COPY . .

RUN sh build.sh

EXPOSE 7001

CMD ["sh","-c", "npm start;tail -f /dev/null"]
