module Proxy
  class Response

    def initialize(response)
      @response = response
    end

    def to_s
      document.to_s
    end

    private

    attr_reader :response

    def body
      response.body
    end

    def document
      Nokogiri::HTML(body)
    end

  end
end
