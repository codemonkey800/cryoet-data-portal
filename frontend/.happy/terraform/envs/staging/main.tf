# Auto-generated by 'happy infra'. Do not edit
# Make improvements in happy, so that everyone can benefit.
data "aws_ssm_parameter" "graphql_endpoint" {
  name = "/cryoet-staging/graphql_endpoint"
}

module "stack" {
  source           = "git@github.com:chanzuckerberg/happy//terraform/modules/happy-stack-eks?ref=jgadling/optional-datadog"
  image_tag        = var.image_tag
  stack_name       = var.stack_name
  k8s_namespace    = var.k8s_namespace
  image_tags       = jsondecode(var.image_tags)
  stack_prefix     = "/${var.stack_name}"
  app_name         = var.app
  deployment_stage = "staging"
  additional_env_vars = {
    API_URL = data.aws_ssm_parameter.graphql_endpoint.value
    ENV = "staging"
  }
  services = {
    frontend = {
      health_check_path     = "/"
      name                  = "frontend"
      path                  = "/*"
      port                  = 8080
      desired_count         = 1
      priority              = 0
      service_type          = "EXTERNAL"
      success_codes         = "200-499"
      memory                = "2000Mi"
      cpu                   = "2000m"
      initial_delay_seconds = 100
    }
  }
  create_dashboard = false
  routing_method   = "CONTEXT"
}
