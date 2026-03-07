FROM node:24-bookworm

RUN apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends locales \
  && sed -i 's/^# *ja_JP.UTF-8 UTF-8/ja_JP.UTF-8 UTF-8/' /etc/locale.gen \
  && locale-gen \
  && update-locale LANG=ja_JP.UTF-8 \
  && rm -rf /var/lib/apt/lists/*

ENV AQUA_ROOT_DIR=/usr/local/aquaproj-aqua
RUN curl -sSfL https://raw.githubusercontent.com/aquaproj/aqua-installer/v4.0.4/aqua-installer | bash \
  && ln -sf /usr/local/aquaproj-aqua/bin/aqua /usr/local/bin/aqua
