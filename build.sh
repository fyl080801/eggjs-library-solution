#!/bin/sh

set -e
begin_time=$(date +%s)
echo $(date +"%Y-%m-%d %H:%M:%S") 'build begin'



# if [ -d output ];then
#     rm -r output
# fi

# echo $(date +"%Y-%m-%d %H:%M:%S") 'set K8S_ENV'
# case $1 in
#     ite)
#         export K8S_ENV='ite'
#         ;;
#     stag)
#         export K8S_ENV='stag'
#         ;;
#     prod)
#         export K8S_ENV='prod'
#         ;;
#     *)
#         export K8S_ENV='prod'
#         ;;
# esac
# echo $(date +"%Y-%m-%d %H:%M:%S") 'set K8S_ENV end'

# npm config set registry http://registry.m.jd.com
npm config set @jd:registry http://registry.m.jd.com
npm config set @jdcloud:registry http://registry.m.jd.com
# # npm config set sass-binary-site http://registry.m.jd.com/mirrors/node-sass

yarn install

yarn build

# echo $(date +"%Y-%m-%d %H:%M:%S") 'client begin'
# cd client && rm -rf node_modules
# npm install

# if [ "$K8S_ENV"x = "ite"x ];
# then
#   echo "at present there is no npm run build:ite script "
# elif [ "$K8S_ENV"x = "stag"x ];
# then
#   echo "npm run build:stage"
#   npm run build:stage
# else
#   echo "npm run build:prod"
#   npm run build:prod
# fi

# echo $(date +"%Y-%m-%d %H:%M:%S") 'client end'

# echo $(date +"%Y-%m-%d %H:%M:%S") 'server begin'
# cd ../server && rm -rf node_modules
# npm install --production

# echo $(date +"%Y-%m-%d %H:%M:%S") 'server end'

end_time=$(date +%s)
cost_time=$(($end_time - $begin_time))
echo "执行共花费：$cost_time 秒"
