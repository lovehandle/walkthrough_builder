module Proxy
  class Client

    def self.get(*args)
      new(*args).get
    end

    def initialize(url)
      @url = url
    end

    def get
      Response.new HTTParty.get(url)
    end

    private

    attr_reader :url

  end
end
