## PROJECT INFO
PROJECT=<%= projectName %>
PROJECTS_DIR=<%= projectFolder %>

## PROJECT VAR
VERBOSE=n
FREERTOS=y

## MAKEFILE
DEF=PROJECT=$(PROJECT) PROJECTS_DIR=$(PROJECTS_DIR) VERBOSE=$(VERBOSE) FREERTOS=$(FREERTOS)

ifeq ($(VERBOSE),y)
	S=
else
	S=-s
endif

all:
	@$(MAKE) $(S) -C ../../ all $(DEF)

%:
	@$(MAKE) $(S) -C ../../ $@ $(DEF)