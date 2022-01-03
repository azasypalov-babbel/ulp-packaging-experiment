FROM ruby:2.7.5-slim as app-bundle

RUN mkdir /tmp/shared

ENV app /web.test
RUN mkdir $app
WORKDIR $app
COPY Gemfile* $app/

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
            build-essential \
            git \
            parallel \
            jq \
            curl

ENV BUNDLER_VERSION 2.2.32
RUN gem update --system \
 && gem install bundler -v $BUNDLER_VERSION \
 && bundle install --system --jobs $(nproc)

FROM app-bundle

COPY --from=app-bundle $app $app

RUN mkdir $app/screenshots

ADD . $app

RUN bundle install

ENTRYPOINT [ docker-entrypoint.sh ]
