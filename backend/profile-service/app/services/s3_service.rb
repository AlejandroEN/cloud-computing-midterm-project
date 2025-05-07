require 'aws-sdk-s3'

class S3Service
  def initialize
    @s3_client = Aws::S3::Client.new(
      region: ENV['AWS_REGION'],
      access_key_id: ENV['AWS_ACCESS_KEY_ID'],
      secret_access_key: ENV['AWS_SECRET_ACCESS_KEY']
    )
  end

  def bucket(type)
    case type
    when :profile_image
      ENV['AWS_S3_BUCKET_PROFILE']
    when :institution_image
      ENV['AWS_S3_BUCKET_INSTITUTION']
    else
      raise ArgumentError, "Invalid bucket type: #{type}"
    end
  end

  def upload_image(type, id, file)
    file_key = "#{type}/#{id}/#{File.basename(file.path)}"

    # Optional: Validate file type
    unless valid_image?(file)
      raise ArgumentError, "Invalid file type. Only images are allowed."
    end

    begin
      @s3_client.put_object(
        bucket: bucket(type),
        key: file_key,
        body: file,
        )
      file_url(type, file_key)
    rescue Aws::S3::Errors::ServiceError => e
      Rails.logger.error("Error uploading file: #{e.message}")
      raise "File upload failed"
    end
  end

  def file_url(type, file_key)
    presigned_url(type, file_key)
  end

  def delete_image(type, id, file_name)
    file_key = "#{type}/#{id}/#{file_name}"
    @s3_client.delete_object(
      bucket: bucket(type),
      key: file_key
    )
  end

  private
    def valid_image?(file)
      file.content_type.start_with?('image')
    end

    def presigned_url(type, file_key)
      @s3_client.presigned_url(:get_object,
                               bucket: bucket(type),
                               key: file_key,
                               expires_in: 3600)
    end
end