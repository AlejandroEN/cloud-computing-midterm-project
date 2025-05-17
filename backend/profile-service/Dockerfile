# syntax=docker/dockerfile:1

# Build arguments
ARG RUBY_VERSION=3.3.8

# Base image with Ruby
FROM docker.io/library/ruby:$RUBY_VERSION-slim AS base

# Set working directory
WORKDIR /rails

# Install base dependencies
RUN apt-get update -qq && \
	apt-get install --no-install-recommends -y \
	curl \
	libjemalloc2 \
	libvips \
	postgresql-client && \
	rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Set environment variables for production
ENV RAILS_ENV="production" \
	BUNDLE_DEPLOYMENT="1" \
	BUNDLE_PATH="/usr/local/bundle" \
	BUNDLE_WITHOUT="development test"

# Build stage
FROM base AS build

# Install build dependencies
RUN apt-get update -qq && \
	apt-get install --no-install-recommends -y \
	build-essential \
	git \
	libpq-dev \
	libyaml-dev \
	pkg-config && \
	rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy Gemfile and Gemfile.lock for bundle installation
COPY Gemfile Gemfile.lock ./

# Install gems and precompile
RUN bundle install && \
	rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git && \
	bundle exec bootsnap precompile --gemfile

# Copy application code
COPY . .

# Precompile application code
RUN bundle exec bootsnap precompile app/ lib/ && \
	chmod +x bin/* && \
	sed -i "s/\r$//g" bin/* && \
	sed -i 's/ruby\.exe"$/ruby/' bin/*

# Final stage for runtime
FROM base

# Copy artifacts from the build stage
COPY --from=build "${BUNDLE_PATH}" "${BUNDLE_PATH}"
COPY --from=build /rails /rails

# Add a non-root user and set permissions
RUN groupadd --system --gid 1000 rails && \
	useradd rails --uid 1000 --gid 1000 --create-home --shell /bin/bash && \
	chown -R rails:rails /rails/db /rails/log /rails/storage /rails/tmp
USER rails

# Entrypoint to prepare the database and start server
ENTRYPOINT ["/rails/bin/docker-entrypoint"]

# Expose application port
EXPOSE 3000

# Default command to start the Rails server
CMD ["bin/rails", "server", "-b", "0.0.0.0"]
