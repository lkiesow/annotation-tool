/**
 *  Copyright 2012, Entwine GmbH, Switzerland
 *  Licensed under the Educational Community License, Version 2.0
 *  (the "License"); you may not use this file except in compliance
 *  with the License. You may obtain a copy of the License at
 *
 *  http://www.osedu.org/licenses/ECL-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an "AS IS"
 *  BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 *  or implied. See the License for the specific language governing
 *  permissions and limitations under the License.
 *
 */

/**
 * Module containing the tool configuration
 * @module annotation-tool-configuration
 */
define(["jquery",
        "underscore",
        "roles",
        "player_adapter_HTML5"
        // Add here the files (PlayerAdapter, ...) required for your configuration
        ],

    function ($, _, ROLES, HTML5PlayerAdapter) {

        "use strict";

        /**
         * Annotations tool configuration object
         * @alias module:annotation-tool-configuration.Configuration
         * @enum
         */
        var Configuration =  {

            /**
             * List of possible layout configuration
             * @alias module:annotation-tool-configuration.Configuration.LAYOUT_CONFIGURATION
             * @memberOf module:annotation-tool-configuration.Configuration
             * @type {Object}
             */
            LAYOUT_CONFIGURATION: {
                /** default configuration */
                DEFAULT: {
                    timeline : true,
                    list     : true,
                    annotate : true,
                    loop     : false
                }
            },

            /**
             * The minmal duration used for annotation representation on timeline
             * @alias module:annotation-tool-configuration.Configuration.MINIMAL_DURATION
             * @memberOf module:annotation-tool-configuration.Configuration
             * @type {Object}
             */
            MINIMAL_DURATION: 5,

            /**
             * Define the number of categories pro tab in the annotate box. Bigger is number, thinner will be the columns for the categories.
             * @alias module:annotation-tool-configuration.Configuration.CATEGORIES_PER_TAB
             * @memberOf module:annotation-tool-configuration.Configuration
             * @type {Number}
             */
            CATEGORIES_PER_TAB: 7,

            /**
             * The maximal number of tracks visible in the timeline at the same time
             * @type {Number}
             */
            MAX_VISIBLE_TRACKS: 0,

            /**
             * Define if the localStorage should be used or not
             * @alias module:annotation-tool-configuration.Configuration.localStorage
             * @type {boolean}
             * @readOnly
             */
            localStorage: true,

            /**
             * List of models using only the localStory sync module
             * @type {Array}
             * @readOnly
             */
            localStorageOnlyModel: [],

            /**
             * Url from the annotations Rest Endpoints
             * @alias module:annotation-tool-configuration.Configuration.restEndpointsUrl
             * @type {string}
             * @readOnly
             */
            restEndpointsUrl: "../../../extended-annotations",

            /**
             * Url for redirect after the logout
             * @alias module:annotation-tool-configuration.Configuration.logoutUrl
             * @type {string}
             * @readOnly
             */
            logoutUrl: undefined,

            /**
             * Url from the export function for statistics usage
             * @alias module:annotation-tool-configuration.Configuration.exportUrl
             * @type {string}
             * @readOnly
             */
            exportUrl: "",

            /**
             * Player adapter implementation to use for the annotations tool
             * @alias module:annotation-tool-configuration.Configuration.playerAdapter
             * @type {module:player-adapter.PlayerAdapter}
             */
            playerAdapter: undefined,

            /**
             * Function to generate the tracks to import in the tool at start time.
             * @alias module:annotation-tool-configuration.Configuration.tracksToImport
             */
            tracksToImport: function () {

                var annStart = 0,
                    duration = annotationTool.playerAdapter.getDuration(),
                    track,
                    tracks = [],
                    diff = 50,
                    nbTracks = 20,       // Number of tracks to generate
                    nbAnnotations = diff * nbTracks, // Number of annotations to generate pro track
                    i,
                    y;

                // Generate tracks
                for (i = nbTracks; i > 1; i--) {
                    nbAnnotations -= diff;

                    track = {
                        id          : "testtrack" + i,
                        name        : "Track " + nbAnnotations,
                        description : "Track dynamically generated for load tests",
                        access      : Math.round(Math.random()),
                        annotations : [],
                        visible: false,
                        annotationsLoaded: true
                    };

                    // Generate  annotations
                    for (y = 0; y < nbAnnotations; y++) {
                        annStart = Math.floor((Math.random() * duration) + 1);

                        track.annotations.push({
                            id: (i * 1000) + y,
                            text: "Annotation " + y + " on track " + nbAnnotations,
                            start: annStart,
                            duration: Math.floor((Math.random() * (duration - annStart)) + annStart)
                        });
                    }

                    tracks.push(track);
                }

                return tracks;
            },


            /**
             * Returns the time interval between each timeupdate event to take into account.
             * It can improve a bit the performance if the amount of annotations is important. 
             * @alias module:annotation-tool-configuration.Configuration.getTimeupdateIntervalForTimeline
             * @return {number} The interval
             */
            getTimeupdateIntervalForTimeline: function () {
                // TODO Check if this function should be linear
                return Math.max(500, annotationTool.getAnnotations().length * 3);

            },

            /**
             * Sets the behavior of the timeline. Enable it to follow the playhead.
             * @alias module:annotation-tool-configuration.Configuration.timelineFollowPlayhead
             * @type {Boolean}
             */
            timelineFollowPlayhead: false,

            /**
             * Formats the given date in 
             * @alias module:annotation-tool-configuration.Configuration.formatDate
             * @type {module:player-adapter.formatDate}
             */
            formatDate: function (date) {
                if (_.isNumber(date)) {
                    date = new Date(date);
                }

                if (_.isDate(date)) {
                    return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
                } else {
                    return "Unvalid date";
                }
            },

            /**
             * Get the tool layout configuration
             * @return {object} The tool layout configuration
             */
            getLayoutConfiguration: function () {
                return this.LAYOUT_CONFIGURATION.DEFAULT;
            },

            /**
             * Define if the structured annotations are or not enabled
             * @alias module:annotation-tool-configuration.Configuration.isStructuredAnnotationEnabled
             * @return {boolean} True if this feature is enabled
             */
            isStructuredAnnotationEnabled: function () {
                return true;
            },

            /**
             * Define if the private-only mode is enabled
             * @alias module:annotation-tool-configuration.Configuration.isPrivateOnly
             * @type {boolean}
             */
            isPrivateOnly: false,

            /**
             * Define if the free text annotations are or not enabled
             * @alias module:annotation-tool-configuration.Configuration.isFreeTextEnabled
             * @return {boolean} True if this feature is enabled
             */
            isFreeTextEnabled: function () {
                return true;
            },

            /**
             * Get the current video id (video_extid)
             * @alias module:annotation-tool-configuration.Configuration.getVideoExtId
             * @return {string} video external id
             */
            getVideoExtId: function () {
                return $("video")[0].id;
            },

            /**
             * Get the external parameters related to video. The supported parameters are now the following:
             *     - video_extid: Required! Same as the value returned by getVideoExtId
             *     - title: The title of the video
             *     - src_owner: The owner of the video in the system
             *     - src_creation_date: The date of the course, when the video itself was created.
             * @alias module:annotation-tool-configuration.Configuration.getVideoExtId
             * @example
             * {
             *     video_extid: 123, // Same as the value returned by getVideoExtId
             *     title: "Math lesson 4", // The title of the video
             *     src_owner: "Professor X", // The owner of the video in the system
             *     src_creation_date: "12-12-1023" // The date of the course, when the video itself was created.
             * }
             * @return {Object} The literal object containing all the parameters described in the example.
             */
            getVideoParameters: function () {
                return {
                    video_extid: this.getVideoExtId(),
                    title: $("video")[0].currentSrc.split("/").pop().split(".")[0],
                    src_owner: $("video").first().attr("data-owner"),
                    src_creation_date:  $("video").first().attr("data-date")
                };
            },

            /**
             * Get the user id from the current context (user_extid)
             * @alias module:annotation-tool-configuration.Configuration.getUserExtId
             * @return {string} user_extid
             */
            getUserExtId: function () {
                return "default";
            },

            /**
             * Get the role of the current user
             * @alias module:annotation-tool-configuration.Configuration.getUserRole
             * @return {ROLE} The current user role
             */
            getUserRole: function () {
                return ROLES.USER;
            },

            /**
             * Get the name of the admin role
             * @alias module:annotation-tool-configuration.Configuration.getAdminRoleName
             * @return {ROLE} The name of the admin role
             */
            getAdminRoleName: function () {
                return ROLES.ADMINISTRATOR;
            },

            /**
             * Get the user authentification token if existing
             * @alias module:annotation-tool-configuration.Configuration.getUserAuthToken
             * @return {string} Current user token
             */
            getUserAuthToken: function () {
                return undefined;
            },

            /**
             * Function to load the video
             * @alias module:annotation-tool-configuration.Configuration.loadVideo
             */
            loadVideo: function () {
                annotationTool.playerAdapter = new HTML5PlayerAdapter($("video")[0]);
            },

            onWindowResize: function () {

            }
        };

        return Configuration;
    }
);
