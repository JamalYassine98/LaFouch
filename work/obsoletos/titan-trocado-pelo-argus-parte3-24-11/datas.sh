# TITAN · cenários do calendário (dia normal + cada data da loja) e sem internet — profundidade 1
cd "$(dirname "$0")"
run(){ TITAN_MAX=480 TITAN_DATA=$1 python3 -u explorador.py 1 ${2:-normal} > /tmp/tt_$1_${2:-normal}.log 2>&1; }
run 2027-03-10 & run 2026-11-20 & run 2026-12-15 & wait
run 2026-12-28 & run 2027-05-08 & run 2027-06-10 & wait
run 2027-03-10 sem_internet & run 2026-12-15 cheio & wait
