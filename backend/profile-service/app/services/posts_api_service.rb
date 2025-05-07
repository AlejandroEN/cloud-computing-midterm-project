class PostsApiService
  def initialize
    @connection = Faraday.new(
      url: ENV['POSTS_MICROSERVICE_URL'],
      headers: {'Content-Type' => 'application/json'}
    )
  end

  def get_posts_by_id(profile_id)
    @connection.get("/posts/#{profile_id}")
  end

  def get_post_me(profile_id)
    @connection.get("/posts/me") do |request|
      request.headers['X-Profile-ID'] = profile_id
    end
  end
end