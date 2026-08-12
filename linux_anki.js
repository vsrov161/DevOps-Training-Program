// Встроенная база данных Linux Anki
window.LINUX_ANKI_DB = {
    title: "Linux Anki",
    icon: "🐧",
    sections: {
        "1": {
            name: "Пользователи, группы, права доступа, sudo",
            questions: [
                {
                    q: "Какой командой посмотреть всех пользователей системы? А только тех, у кого есть shell?",
                    a: "`getent passwd` или `cat /etc/passwd`\nТолько с shell: `getent passwd | grep -E '/bin/(bash|sh|zsh)$'`"
                },
                {
                    q: "Как узнать UID и GID текущего пользователя? Как узнать то же самое для пользователя `www-data`?",
                    a: "`id`\n`id www-data`"
                },
                {
                    q: "Создай пользователя `devops` с домашней директорией, bash в качестве shell и комментарием «DevOps Engineer».",
                    a: "`sudo adduser devops`\nили полностью неинтерактивно:\n`sudo useradd -m -s /bin/bash -c \"DevOps Engineer\" devops`\n`sudo passwd devops`"
                },
                {
                    q: "Создай пользователя `tempuser` без домашней директории и без возможности логина (shell `/usr/sbin/nologin`).",
                    a: "`sudo useradd -s /usr/sbin/nologin tempuser`\n(без `-m`, чтобы не создавать домашнюю)"
                },
                {
                    q: "Что будет, если создать пользователя с уже существующим UID?",
                    a: "Ошибка: `useradd: UID 'xxxx' already exists`"
                },
                {
                    q: "Как принудительно задать UID=1500 и GID=1500 при создании пользователя?",
                    a: "`sudo useradd -u 1500 -g 1500 -m -s /bin/bash username`"
                },
                {
                    q: "Создай группу `developers` и группу `admins`.",
                    a: "`sudo groupadd developers`\n`sudo groupadd admins`"
                },
                {
                    q: "Добавь пользователя `devops` в группы `developers` и `sudo` одновременно одной командой.",
                    a: "`sudo usermod -aG developers,sudo devops`"
                },
                {
                    q: "Как посмотреть, в каких группах состоит пользователь `devops`? А какие пользователи входят в группу `developers`?",
                    a: "`groups devops` или `id devops`\nЧлены группы: `getent group developers`"
                },
                {
                    q: "Удали пользователя `tempuser` вместе с его домашней директорией (если она появилась) и почтовым ящиком.",
                    a: "`sudo deluser --remove-home tempuser`"
                },
                {
                    q: "Что произойдёт, если удалить группу, в которой ещё есть пользователи?",
                    a: "Группа удалится, у пользователей primary group станет числовым GID (или «nogroup»)."
                },
                {
                    q: "Создай файл `/tmp/secret.txt` от имени root. Сделай так, чтобы пользователь `devops` мог его читать, но не мог изменять и удалять.",
                    a: "`sudo chown root:root /tmp/secret.txt`\n`sudo chmod 644 /tmp/secret.txt`"
                },
                {
                    q: "Установи на директорию `/opt/app` права: владелец `devops`, группа `developers`, владелец может всё, группа — читать и выполнять, остальные — ничего.",
                    a: "`sudo chown devops:developers /opt/app`\n`sudo chmod 750 /opt/app`"
                },
                {
                    q: "Что делает `umask`? Какой umask нужно поставить, чтобы новые файлы создавались с правами 640, а директории — 750?",
                    a: "`umask` показывает маску (по умолчанию обычно 0022).\nНужный umask: `027` (файлы 640, директории 750)."
                },
                {
                    q: "Объясни разницу между `chmod 755` и `chmod u=rwx,g=rx,o=rx`.",
                    a: "Результат одинаковый. Первая запись — восьмеричная, вторая — символьная."
                },
                {
                    q: "Что такое SUID, SGID и sticky bit? Приведи практический пример, когда каждый из них нужен.",
                    a: "- **SUID** — процесс запускается с правами владельца файла (`passwd`, `sudo`).\n- **SGID** на файле — запускается с правами группы файла. На директории — новые файлы наследуют группу директории.\n- **Sticky bit** (`+t`) — удалять файлы может только владелец файла (используется в `/tmp`)."
                },
                {
                    q: "Найди все файлы в системе с установленным SUID-битом.",
                    a: "`find / -perm -4000 -type f 2>/dev/null`"
                },
                {
                    q: "Создай директорию `/data/shared`. Сделай так, чтобы все новые файлы внутри неё автоматически принадлежали группе `developers` (SGID).",
                    a: "`sudo mkdir -p /data/shared`\n`sudo chown :developers /data/shared`\n`sudo chmod 2775 /data/shared`"
                },
                {
                    q: "Что будет, если на директорию поставить sticky bit (`chmod +t`)? Где это уже используется в системе?",
                    a: "Удалять файл может только его владелец (или root). Уже стоит на `/tmp` и `/var/tmp`."
                },
                {
                    q: "Пользователь `devops` должен иметь возможность выполнять `systemctl restart nginx` без пароля. Как это настроить через sudoers?",
                    a: "`sudo visudo`\nДобавить:\n`devops ALL=(ALL) NOPASSWD: /bin/systemctl restart nginx`"
                },
                {
                    q: "Как правильно редактировать sudoers? Что будет, если допустить синтаксическую ошибку?",
                    a: "Только через `visudo`. При синтаксической ошибке sudo может полностью перестать работать."
                },
                {
                    q: "Проверь, какие права sudo есть у текущего пользователя.",
                    a: "`sudo -l`"
                },
                {
                    q: "Создай файл с правами 777. Потом с помощью ACL дай пользователю `devops` только чтение, а группе `developers` — чтение и запись, при этом обычные права оставь 644.",
                    a: "`sudo setfacl -m u:devops:r,g:developers:rw file`\n`sudo chmod 644 file`"
                },
                {
                    q: "Как посмотреть текущие ACL на файле/директории? Как их полностью убрать?",
                    a: "Посмотреть: `getfacl file`\nУбрать все ACL: `sudo setfacl -b file`"
                },
                {
                    q: "Симуляция: создай структуру для команды из 5 человек. Нужны пользователи `alice`, `bob`, `charlie`, `dave`, `eve`. Группы: `frontend`, `backend`, `devops-team`. Alice и Bob — frontend, Charlie и Dave — backend, Eve — devops-team + sudo. Общая директория `/projects` с правильными правами и SGID.",
                    a: "```bash\nsudo groupadd frontend\nsudo groupadd backend\nsudo groupadd devops-team\n\nsudo adduser alice\nsudo adduser bob\nsudo adduser charlie\nsudo adduser dave\nsudo adduser eve\n\nsudo usermod -aG frontend alice\nsudo usermod -aG frontend bob\nsudo usermod -aG backend charlie\nsudo usermod -aG backend dave\nsudo usermod -aG devops-team,sudo eve\n\nsudo mkdir /projects\nsudo chown root:developers /projects\nsudo chmod 2775 /projects\n```"
                }
            ]
        },
        "2": {
            name: "Файловая система, диски, разделы, монтирование, LVM",
            questions: [
                {
                    q: "Какой командой посмотреть все блочные устройства и их разделы?",
                    a: "`lsblk -f`\n`sudo fdisk -l`\n`sudo parted -l`"
                },
                {
                    q: "Как узнать, какая файловая система на `/` и сколько на ней свободно?",
                    a: "`df -hT /`\n`findmnt /`"
                },
                {
                    q: "Создай loop-устройство из файла на 2 ГБ и сделай на нём раздел.",
                    a: "```bash\ndd if=/dev/zero of=~/disk.img bs=1M count=2048\nsudo losetup -fP ~/disk.img\nsudo fdisk /dev/loop0\n```"
                },
                {
                    q: "Отформатируй этот раздел в ext4 с меткой `DATA`.",
                    a: "`sudo mkfs.ext4 -L DATA /dev/loop0p1`"
                },
                {
                    q: "Примонтируй его в `/mnt/data` и сделай так, чтобы он монтировался автоматически при загрузке.",
                    a: "```bash\nsudo mkdir /mnt/data\nsudo mount /dev/loop0p1 /mnt/data\nsudo blkid /dev/loop0p1\n# в /etc/fstab:\nUUID=xxxx-xxxx  /mnt/data  ext4  defaults  0  2\n```"
                },
                {
                    q: "Что будет, если в `/etc/fstab` указать неверный UUID?",
                    a: "При загрузке система уйдёт в emergency mode или раздел просто не примонтируется (зависит от флагов)."
                },
                {
                    q: "Как правильно найти UUID раздела? А PARTUUID?",
                    a: "`sudo blkid`\n`lsblk -o NAME,UUID,PARTUUID,FSTYPE,LABEL`"
                },
                {
                    q: "Создай swap-файл на 2 ГБ, активируй его и добавь в fstab.",
                    a: "```bash\nsudo fallocate -l 2G /swapfile\nsudo chmod 600 /swapfile\nsudo mkswap /swapfile\nsudo swapon /swapfile\n# в fstab:\n/swapfile  none  swap  sw  0  0\n```"
                },
                {
                    q: "В чём разница между `mount -a` и простой перезагрузкой при ошибке в fstab?",
                    a: "`mount -a` проверяет fstab без перезагрузки. При ошибке в fstab система может не загрузиться нормально."
                },
                {
                    q: "Покажи все смонтированные файловые системы в «человеческом» виде.",
                    a: "`findmnt`\n`df -h`"
                },
                {
                    q: "Что делает `df -hT` и `du -sh *`? Когда какой использовать?",
                    a: "`df` — смотрит по файловым системам.\n`du` — считает реальное использование внутри директорий."
                },
                {
                    q: "Найди самые большие директории в `/var`.",
                    a: "`sudo du -h --max-depth=1 /var 2>/dev/null | sort -hr | head -20`"
                },
                {
                    q: "Создай LVM: physical volume → volume group `vg_data` → logical volume `lv_app` на 1 ГБ.",
                    a: "```bash\nsudo pvcreate /dev/sdb\nsudo vgcreate vg_data /dev/sdb\nsudo lvcreate -L 1G -n lv_app vg_data\n```"
                },
                {
                    q: "Отформатируй LV в xfs и примонтируй.",
                    a: "```bash\nsudo mkfs.xfs /dev/vg_data/lv_app\nsudo mkdir /mnt/app\nsudo mount /dev/vg_data/lv_app /mnt/app\n```"
                },
                {
                    q: "Расширь logical volume на +500 МБ «на лету» (с xfs).",
                    a: "```bash\nsudo lvextend -L +500M /dev/vg_data/lv_app\nsudo xfs_growfs /mnt/app\n```"
                },
                {
                    q: "Как уменьшить logical volume (осторожно!)?",
                    a: "С xfs почти невозможно корректно уменьшить. С ext4: сначала `resize2fs`, потом `lvreduce`. На проде лучше не делать."
                },
                {
                    q: "Что такое thin provisioning в LVM и когда его используют?",
                    a: "Позволяет выдавать логическим томам больше места, чем есть физически. Широко используется в облаках и контейнерных платформах."
                },
                {
                    q: "Создай snapshot logical volume и потом удали его.",
                    a: "```bash\nsudo lvcreate -s -n snap -L 200M /dev/vg_data/lv_app\nsudo lvremove /dev/vg_data/snap\n```"
                },
                {
                    q: "Как посмотреть, какие процессы держат файл/директорию открытой (не даёт отмонтировать)?",
                    a: "`sudo lsof +D /mnt/data`\n`sudo fuser -mv /mnt/data`"
                },
                {
                    q: "Что будет, если отмонтировать файловую систему, на которой кто-то находится (`cd` туда)?",
                    a: "`umount: target is busy`. Решения: `umount -l` (lazy) или убить процессы."
                },
                {
                    q: "Как сделать bind-mount директории и зачем это нужно?",
                    a: "`sudo mount --bind /source /target`\nНужно для chroot, контейнеров, docker volumes и т.д."
                }
            ]
        },
        "3": {
            name: "Процессы, ресурсы, приоритеты",
            questions: [
                {
                    q: "Как посмотреть все процессы в системе в древовидном виде?",
                    a: "`pstree -p`\n`ps axjf`"
                },
                {
                    q: "Найди PID процесса, который слушает порт 22.",
                    a: "`ss -tlnp | grep ':22'`\n`sudo lsof -i :22`"
                },
                {
                    q: "Как убить процесс по имени, а не по PID?",
                    a: "`pkill -f processname`\n`killall processname`"
                },
                {
                    q: "В чём разница между `kill`, `kill -9`, `kill -15`, `pkill`, `killall`?",
                    a: "- `kill PID` = `kill -15` (SIGTERM) — вежливое завершение\n- `kill -9` — SIGKILL (нельзя перехватить)\n- `pkill` / `killall` — по имени"
                },
                {
                    q: "Запусти процесс в фоне, переведи его в фон после запуска, верни на передний план.",
                    a: "`command &` → `Ctrl+Z` → `bg` → `fg`"
                },
                {
                    q: "Что такое zombie-процесс и как его найти?",
                    a: "Процесс-зомби (состояние Z). Искать: `ps aux | grep ' Z'`"
                },
                {
                    q: "Как изменить приоритет (nice) уже работающего процесса?",
                    a: "`renice -n 10 -p PID`"
                },
                {
                    q: "Запусти команду с nice = 10. Что это значит?",
                    a: "Процесс станет «вежливее» (ниже приоритет)."
                },
                {
                    q: "Покажи топ процессов по потреблению CPU и по памяти.",
                    a: "`htop` (удобнее всего)\n`ps aux --sort=-%cpu | head`\n`ps aux --sort=-%mem | head`"
                },
                {
                    q: "Как ограничить процесс по CPU и памяти с помощью systemd-run или cgroups?",
                    a: "`sudo systemd-run --scope -p MemoryMax=300M -p CPUQuota=30% command`"
                },
                {
                    q: "Найди все процессы пользователя `devops`.",
                    a: "`ps -u devops`\n`pgrep -a -u devops`"
                },
                {
                    q: "Что показывает `ps aux` vs `ps -ef` vs `ps -ejH`?",
                    a: "- `ps aux` — BSD-формат\n- `ps -ef` — System V\n- `ps -ejH` — иерархия + сессии + jobs"
                },
                {
                    q: "Как посмотреть открытые файлы конкретного процесса?",
                    a: "`sudo lsof -p PID`"
                },
                {
                    q: "Симуляция: «приложение» жрёт 100% CPU. Найди его, понизь приоритет, если не поможет — аккуратно заверши.",
                    a: "`top`/`htop` → `renice` → `kill -15` → если нет — `-9`"
                },
                {
                    q: "Что будет, если процесс получит сигнал SIGTERM? А SIGKILL?",
                    a: "SIGTERM можно обработать (корректное завершение). SIGKILL — нельзя, процесс убивается ядром сразу."
                },
                {
                    q: "Как сделать так, чтобы процесс продолжал работать после закрытия терминала?",
                    a: "`nohup command &`\n`disown`\nили лучше systemd-сервис / tmux / screen"
                },
                {
                    q: "Посмотри нагрузку на систему за последнюю 1/5/15 минут.",
                    a: "`uptime`\n`cat /proc/loadavg`"
                },
                {
                    q: "Что означает load average 4.00 на машине с 2 ядрами?",
                    a: "Система сильно перегружена (средняя очередь процессов = 4 при 2 ядрах)."
                }
            ]
        },
        "4": {
            name: "Systemd, сервисы, логи",
            questions: [
                {
                    q: "Как посмотреть статус сервиса `ssh`? А все failed-сервисы?",
                    a: "`systemctl status ssh`\n`systemctl --failed`"
                },
                {
                    q: "Перезапусти сервис и посмотри его логи за последние 10 минут.",
                    a: "`sudo systemctl restart ssh`\n`journalctl -u ssh --since \"10 min ago\"`"
                },
                {
                    q: "Создай простой systemd-сервис, который раз в минуту пишет «Hello from systemd» в файл.",
                    a: "Пример unit-файла `/etc/systemd/system/hello.service`:\n```ini\n[Unit]\nDescription=Hello Service\n\n[Service]\nType=oneshot\nExecStart=/bin/bash -c 'echo Hello from systemd >> /tmp/hello.log'\n\n[Install]\nWantedBy=multi-user.target\n```"
                },
                {
                    q: "Как сделать сервис автоматически запускающимся при загрузке?",
                    a: "`sudo systemctl enable hello.service`"
                },
                {
                    q: "В чём разница между `systemctl start`, `enable`, `disable`, `mask`?",
                    a: "- `start` — запустить сейчас\n- `enable` — добавить в автозагрузку\n- `disable` — убрать из автозагрузки\n- `mask` — полностью запретить запуск (даже вручную)"
                },
                {
                    q: "Создай timer, который запускает твой сервис каждые 5 минут.",
                    a: "Создаётся отдельный `hello.timer`:\n```ini\n[Unit]\nDescription=Run hello every 5 minutes\n\n[Timer]\nOnCalendar=*:0/5\nPersistent=true\n\n[Install]\nWantedBy=timers.target\n```"
                },
                {
                    q: "Как посмотреть все логи системы с приоритетом err и выше за сегодня?",
                    a: "`journalctl -p err --since today`"
                },
                {
                    q: "Найди в journal все сообщения, связанные с `sshd` за последний час.",
                    a: "`journalctl -u ssh --since \"1 hour ago\"`"
                },
                {
                    q: "Как ограничить размер journald и вакуумить старые логи?",
                    a: "В `/etc/systemd/journald.conf`:\n`SystemMaxUse=500M`\nЗатем: `sudo systemctl restart systemd-journald`\nОчистка: `sudo journalctl --vacuum-size=300M`"
                },
                {
                    q: "Симуляция: сервис падает. Нужно понять почему (логи + статус + journal).",
                    a: "`systemctl status` + `journalctl -xe` + `journalctl -u servicename -b`"
                },
                {
                    q: "Как перезагрузить конфигурацию systemd без перезагрузки машины?",
                    a: "`sudo systemctl daemon-reload`"
                },
                {
                    q: "Что делает `systemctl daemon-reload`?",
                    a: "Перечитывает все unit-файлы с диска."
                },
                {
                    q: "Как посмотреть зависимости конкретного сервиса?",
                    a: "`systemctl list-dependencies ssh.service`"
                },
                {
                    q: "Сделай так, чтобы сервис стартовал только после того, как поднялась сеть.",
                    a: "В секции `[Unit]`:\n```ini\nAfter=network-online.target\nWants=network-online.target\n```"
                }
            ]
        },
        "5": {
            name: "Сеть",
            questions: [
                {
                    q: "Покажи все IP-адреса машины и какой интерфейс какой.",
                    a: "`ip -br a`\n`ip a`"
                },
                {
                    q: "Какой командой посмотреть маршруты?",
                    a: "`ip route`\n`ip r`"
                },
                {
                    q: "Как посмотреть, какие порты слушаются и какими процессами?",
                    a: "`ss -tulnp`"
                },
                {
                    q: "Проверь доступность `8.8.8.8` и `google.com` (и по ICMP, и по TCP 443).",
                    a: "```bash\nping -c 4 8.8.8.8\nping -c 4 google.com\ncurl -I https://google.com\nnc -zv google.com 443\n```"
                },
                {
                    q: "Что делает `ss -tulnp`? Чем лучше `netstat`?",
                    a: "`ss` — современная, быстрее и информативнее замена `netstat`."
                },
                {
                    q: "Настрой временный IP на интерфейсе.",
                    a: "`sudo ip addr add 192.168.56.50/24 dev enp0s3` (имя интерфейса посмотри через `ip a`)"
                },
                {
                    q: "Как посмотреть текущие DNS-серверы? Где они реально прописаны в Ubuntu 24.04?",
                    a: "`resolvectl status`\nРеально управляется через `systemd-resolved` и `/etc/systemd/resolved.conf` + netplan."
                },
                {
                    q: "Очисти кэш DNS (systemd-resolved).",
                    a: "`resolvectl flush-caches`"
                },
                {
                    q: "С помощью `ufw` разреши SSH только с конкретной подсети и включи файрвол.",
                    a: "```bash\nsudo ufw allow from 192.168.56.0/24 to any port 22\nsudo ufw enable\nsudo ufw status verbose\n```"
                },
                {
                    q: "Посмотри правила iptables/nftables.",
                    a: "`sudo nft list ruleset`\n(в Ubuntu 24.04 по умолчанию nftables)"
                },
                {
                    q: "Симуляция: «сайт не открывается». Диагностика от `ping` → `traceroute` → `dig` → `curl -v` → `ss`.",
                    a: "Классический troubleshooting path: ping → traceroute → dig → curl -v → ss"
                },
                {
                    q: "Как сделать port-forwarding через ssh?",
                    a: "`ssh -L 8080:localhost:80 user@remote_server`"
                },
                {
                    q: "Покажи статистику по сетевым интерфейсам (пакеты, ошибки).",
                    a: "`ip -s link`\n`cat /proc/net/dev`"
                },
                {
                    q: "Найди все машины в локальной сети (быстрый скан).",
                    a: "`nmap -sn 192.168.56.0/24` (если nmap установлен)\nили `arp-scan --local`"
                }
            ]
        },
        "6": {
            name: "Текст, поиск, пайпы, регулярки",
            questions: [
                {
                    q: "Найди все файлы, изменённые за последние 24 часа в `/etc`.",
                    a: "`find /etc -type f -mtime -1`"
                },
                {
                    q: "Найди все `.conf` файлы и выведи только те строки, где есть `Port`.",
                    a: "`grep -r --include=\"*.conf\" \"Port\" /etc`"
                },
                {
                    q: "Посчитай количество уникальных IP в access.log (представь, что он есть).",
                    a: "`awk '{print $1}' access.log | sort | uniq -c | sort -nr`"
                },
                {
                    q: "Замени во всех файлах директории слово `old` на `new` рекурсивно.",
                    a: "`grep -rl 'old' /path | xargs sed -i 's/old/new/g'`"
                },
                {
                    q: "Вырежи из файла 3–7 колонки и отсортируй уникальные значения.",
                    a: "`cut -d' ' -f3-7 file | sort | uniq`"
                },
                {
                    q: "Как работает `xargs`? Приведи пример удаления файлов из списка.",
                    a: "`cat list.txt | xargs rm -f`\nили `find ... -print0 | xargs -0 rm -f`"
                },
                {
                    q: "Найди процессы и сразу убей все, что содержат `python`.",
                    a: "`pkill -f python`\nили `ps aux | grep python | awk '{print $2}' | xargs kill`"
                },
                {
                    q: "Симуляция: нужно из большого лога достать все ERROR за сегодня и сохранить в файл + посчитать количество.",
                    a: "```bash\ngrep \"ERROR\" /var/log/syslog | grep \"$(date +%Y-%m-%d)\" > errors_today.txt\nwc -l errors_today.txt\n```"
                }
            ]
        },
        "7": {
            name: "Комплексные симуляции рабочих задач",
            questions: [
                {
                    q: "Подними «боевую» структуру:\n- Пользователи и группы под команду\n- Директории `/opt/apps`, `/data/logs`, `/data/backups` с правильными правами и SGID\n- Отдельный LV под логи\n- Systemd-сервис «приложения», которое пишет логи\n- Logrotate для этих логов\n- Cron/systemd-timer для бэкапа",
                    a: "Пример базовой структуры:\n```bash\n# группы и пользователи (см. упр. 25)\nsudo mkdir -p /opt/apps /data/logs /data/backups\nsudo chown -R root:developers /opt/apps /data/logs /data/backups\nsudo chmod 2775 /opt/apps /data/logs /data/backups\n\n# LV под логи (пример)\nsudo lvcreate -L 2G -n lv_logs vg_data\nsudo mkfs.xfs /dev/vg_data/lv_logs\n# прописать в fstab и примонтировать в /data/logs\n```"
                },
                {
                    q: "Напиши bash-скрипт, который:\n- Создаёт пользователя\n- Добавляет в группы\n- Создаёт домашние директории с правильными правами\n- Генерирует SSH-ключ\n- Добавляет публичный ключ в authorized_keys",
                    a: "```bash\n#!/bin/bash\nUSER=$1\nsudo adduser --disabled-password --gecos \"\" $USER\nsudo usermod -aG developers $USER\nsudo mkdir -p /home/$USER/.ssh\nsudo ssh-keygen -t ed25519 -f /home/$USER/.ssh/id_ed25519 -N \"\" -C \"$USER@devops\"\nsudo cat /home/$USER/.ssh/id_ed25519.pub | sudo tee -a /home/$USER/.ssh/authorized_keys\nsudo chown -R $USER:$USER /home/$USER/.ssh\nsudo chmod 700 /home/$USER/.ssh\nsudo chmod 600 /home/$USER/.ssh/authorized_keys\n```"
                },
                {
                    q: "Полный troubleshooting-сценарий «сервер тормозит»:\n- load average\n- iowait\n- кто жрёт диск (`iotop`, `iotop -o`)\n- кто жрёт память\n- какие процессы в D-state",
                    a: "```bash\nuptime\ntop\nhtop\niostat -xz 1          # если установлен sysstat\niotop -o\nps aux --sort=-%mem | head\nps aux | awk '$8 ~ /D/ {print}'     # процессы в D-state\n```"
                }
            ]
        }
    }
};

console.log('Linux Anki DB loaded. Sections:', Object.keys(window.LINUX_ANKI_DB.sections).length);