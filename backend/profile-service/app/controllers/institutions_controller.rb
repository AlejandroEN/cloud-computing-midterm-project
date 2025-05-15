class InstitutionsController < ApplicationController
  before_action :set_institution, only: %i[show update destroy]
  before_action :set_own_institution, only: %i[show_own_institution]

  # GET institutions
  def index
    @institutions = Institution.select(:id, :name, :image_key)

    render json: @institutions
  end

  # GET institutions/1
  def show
    if @institution
      render json: @institution, status: :ok
    else
      render json: { error: 'Unable to fetch institution' }, status: :unprocessable_entity
    end
  end

  # GET profiles/me/institutions
  def show_own_institution
    render json: { id: @institution.id, name: @institution.name, image_key: @institution.image_key }
  end

  # POST institutions
  def create
    @institution = Institution.new(create_institution_params)

    if @institution.save
      render json: @institution, status: :created, location: @institution
    else
      render json: @institution.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT institutions/1
  def update
    return unless @institution

    update_params = update_institution_params

    if params[:new_institution_image].present?
      s3_service = S3Service.new
      uploaded_image_key = s3_service.upload_image(:institution_image, @institution.id, params[:new_institution_image])

      old_image_key = @institution.image_key
      s3_service.delete_image(:institution_image, @institution.id, old_image_key) if old_image_key.present?

      update_params = update_params.merge(image_key: uploaded_image_key)
    end

    if @institution.update(update_params)
      render json: @institution, status: :ok
    else
      render json: @institution.errors, status: :unprocessable_entity
    end
  end

  # DELETE /institutions/1
  def destroy
    @institution.destroy!
    render json: { message: 'Institution successfully deleted' }, status: :ok
  rescue ActiveRecord::RecordNotDestroyed
    render json: { error: 'Failed to delete Institution' }, status: :unprocessable_entity
  end

  private
  def set_institution
    @institution = Institution.find_by(id: params[:id])
    unless @institution
      render json: { error: 'Institution not found' }, status: :not_found
    end
  end


    def set_own_institution
      institution_id = request.headers["X-Institution-ID"]

      if institution_id.present?
        @institution = Institution.find_by(id: institution_id)
      else
        render json: { error: "Profile ID header missing" }, status: :bad_request
      end

    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Institution not found' }, status: :not_found
    end

    def create_institution_params
      params.expect(institution: [ :name, :domain, :image_key ])
    end

    def update_institution_params
      params.require(:institution).permit(:name, :domain, :uploaded_image )
    end
end
