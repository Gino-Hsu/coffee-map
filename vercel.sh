case "$VERCEL_GIT_COMMIT_REF" in
  main|test) exit 1 ;;  # 要建置
  *) exit 0 ;;             # 其他都跳過
esac
