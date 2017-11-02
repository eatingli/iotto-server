
# 在 Raspberry PI 上部署
需要在開機時啟動 mcs-lite、iotto-server、avahi-restart

# 開機時執行
- 使用 update-rc.d 來達成開機執行
- 需要在 /etc/init.d 下編輯特定 [Script](https://gist.github.com/naholyr/4275302#file-service-sh-L20)
- 

# PI
- 192.168.1.222
- pi 12369874

# mcs-lite
- /etc/7688/server.js

# avahi-restart (停用)
- avahi 在 pi 上幾分鐘會掛掉，所以設定定時自動重啟
- /etc/init.d/run-avahi-restart
- /etc/run-avahi-restart.sh
- 重啟: sudo /etc/init.d/avahi-daemon restart

# iotto-server
- /etc/iotto-server/app/build/server.js

# boot
- /etc/run-iotto.sh
- /etc/init.d/run-iotto