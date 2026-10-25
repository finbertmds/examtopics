#!/usr/bin/env python3
"""Chạy tuần tự 11 file AWS; mỗi tiến trình kết thúc rồi mới chạy file kế tiếp.

    python3 batch/run_fix_examtopics_links.py
    python3 batch/run_fix_examtopics_links.py --only-unresolved --engines ''
    python3 batch/run_fix_examtopics_links.py --dry-run

Các tùy chọn ngoài --dry-run được chuyển tiếp cho fix_examtopics_links.py.
"""
import argparse
from pathlib import Path
import shlex
import subprocess
import sys


EXAMS = (
    'aws-clf-c02',
    'aws-da-c00',
    'aws-db-c00',
    'aws-dea-c01',
    'aws-dop-c00',
    'aws-dva-c02',
    'aws-ml-c00',
    'aws-mla-c01',
    'aws-pas-c01',
    'aws-saa-c03',
    'aws-sap-c02',
    'aws-soa-c00',
)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--dry-run', action='store_true', help='In các lệnh, không chạy và không sửa JSON')
    args, forwarded = parser.parse_known_args()
    if forwarded[:1] == ['--']:
        forwarded = forwarded[1:]
    base = Path(__file__).resolve().parent
    fixer = base / 'fix_examtopics_links.py'
    required = [fixer, *(base / 'json' / (exam + '.json') for exam in EXAMS)]
    missing = [str(path) for path in required if not path.is_file()]
    if missing:
        print('Thiếu file:\n' + '\n'.join(missing), file=sys.stderr)
        return 1

    failed = []
    completed = 0
    for index, exam in enumerate(EXAMS, 1):
        command = [sys.executable, str(fixer), str(base / 'json' / (exam + '.json')), *forwarded]
        print(f'\n[{index}/{len(EXAMS)}] {exam}.json', flush=True)
        print(shlex.join(command), flush=True)
        if args.dry_run:
            continue
        try:
            # Chặn tại đây cho đến khi tiến trình hiện tại kết thúc; không chạy song song.
            result = subprocess.run(command, cwd=base, check=False)
        except KeyboardInterrupt:
            print('\nĐã dừng; không khởi chạy file tiếp theo.', file=sys.stderr)
            return 130
        except OSError as exc:
            print(f'Không thể chạy {exam}: {exc}', file=sys.stderr)
            failed.append((exam, 'launch_error'))
            continue
        if result.returncode in (130, -2):
            print('\nĐã dừng; không khởi chạy file tiếp theo.', file=sys.stderr)
            return 130
        if result.returncode:
            failed.append((exam, result.returncode))
            print(f'{exam}: kết thúc với mã lỗi {result.returncode}; chuyển sang file tiếp theo.', flush=True)
        else:
            completed += 1
            print(f'{exam}: chạy xong. Xem reports/ để biết các link đã xác minh.', flush=True)

    if args.dry_run:
        print(f'\nĐã liệt kê {len(EXAMS)} lệnh; chưa chạy hoặc sửa file nào.')
        return 0
    print(f'\nĐã chạy hết danh sách: {completed}/{len(EXAMS)} file kết thúc với mã 0.', flush=True)
    if failed:
        print('Các file cần kiểm tra lại:', flush=True)
        for exam, code in failed:
            print(f'  {exam}.json — {code}', flush=True)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
